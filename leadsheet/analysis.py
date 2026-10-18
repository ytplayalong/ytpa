"""Audio analysis: beats, bars, key, chords and melody."""

from dataclasses import dataclass

import librosa
import numpy as np

SR = 22050
HOP = 512

NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
NOTE_NAMES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

# Tunable parameters of the chord model (see leadsheet.benchmark)
TUNING = {
    "emission_scale": 20.0,
    "bass_weight": 0.15,
    "p_down": 0.5,  # chord change probability on the downbeat
    "p_mid": 0.2,  # in the middle of the bar
    "p_other": 0.04,  # elsewhere
    "w_diatonic": 1.0,
    "w_scale": 0.25,
    "w_seventh": 0.2,
    "w_chromatic": 0.04,
    "chroma_source": "accomp",  # "accomp" or "mix"
    "chroma_power": 1.0,  # <1 compresses the chroma (reduces loud partials)
}

# Tunable parameters of the melody extraction
MELODY = {
    "periodicity": 0.3,  # CREPE confidence needed for a voiced frame
    "gate_db": 40.0,  # ignore frames this much quieter than the loud parts
    "correct_tuning": True,  # compensate for audio that is not tuned to A=440
    "median": 5,  # median filter length (frames)
    "max_gap": 0.15,  # seconds of silence allowed within a note
    "min_len": 0.12,  # shortest note in seconds
    "split_semitones": 1.2,  # pitch jump that starts a new note
    "octave_fix": False,  # repair single notes that jumped an octave
    "onset_split": True,  # split notes at vocal onsets
    "onset_delta": 0.1,
    "onset_margin": 0.08,
}

# Chord kinds: (musicxml kind, symbol suffix, intervals, bias)
CHORD_KINDS = [
    ("major", "", (0, 4, 7), 0.0),
    ("minor", "m", (0, 3, 7), 0.0),
    ("dominant", "7", (0, 4, 7, 10), -0.06),
    ("minor-seventh", "m7", (0, 3, 7, 10), -0.06),
    ("major-seventh", "maj7", (0, 4, 7, 11), -0.08),
]

# Krumhansl-Schmuckler key profiles
KS_MAJOR = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
KS_MINOR = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])


@dataclass
class Chord:
    root: int  # pitch class
    kind: int  # index into CHORD_KINDS


@dataclass
class Note:
    start: float  # seconds
    end: float
    midi: int
    midi_f: float = 0.0  # unrounded median pitch


@dataclass
class Analysis:
    duration: float
    tempo: float
    beat_times: np.ndarray  # seconds, all detected beats
    downbeat_phase: int  # index into beat_times of the first downbeat
    beats_per_bar: int
    fifths: int  # key signature
    minor: bool
    chords: list  # Chord, one per beat (aligned with beat_times)
    notes: list  # Note
    meter: tuple = (4, 4)  # time signature (beats, beat type)
    beat_div: int = 4  # divisions per beat (quarter = 4 divisions)


def load_audio(path: str) -> np.ndarray:
    y, _ = librosa.load(path, sr=SR, mono=True)
    return y


def _cached(cache_dir, path: str, suffix: str, compute):
    """Caches the result (dict of arrays) of an expensive step on disk."""
    if cache_dir is None:
        return compute()
    from pathlib import Path

    cache_file = Path(cache_dir) / f"{Path(path).stem}.{suffix}.npz"
    if cache_file.exists():
        data = np.load(cache_file)
        return {k: data[k] for k in data.files}
    out = compute()
    cache_file.parent.mkdir(parents=True, exist_ok=True)
    np.savez(cache_file, **out)
    return out


def separate_vocals(path: str):
    """Splits the audio into (vocals, accompaniment, bass) at SR using Demucs."""
    import torch
    from demucs.apply import apply_model
    from demucs.pretrained import get_model

    model = get_model("htdemucs")
    model.eval()
    y, _ = librosa.load(path, sr=model.samplerate, mono=False)
    if y.ndim == 1:
        y = np.stack([y, y])
    device = "cuda" if torch.cuda.is_available() else "cpu"
    with torch.no_grad():
        out = apply_model(
            model, torch.tensor(y)[None], device=device, split=True, progress=False
        )[0].numpy()
    vocals = out[model.sources.index("vocals")].mean(axis=0)
    bass = out[model.sources.index("bass")].mean(axis=0)
    accomp = out.sum(axis=0).mean(axis=0) - vocals
    resample = lambda x: librosa.resample(x, orig_sr=model.samplerate, target_sr=SR)
    return resample(vocals), resample(accomp), resample(bass)


def fit_constant_grid(onset_env: np.ndarray, tempo: float, duration: float):
    """Fits a constant tempo beat grid (tempo and phase) to the onset envelope.

    Dynamic beat trackers tend to slip by half a beat in the middle of a song,
    which ruins bars and sync. Studio recordings usually have a constant tempo.
    """
    fps = SR / HOP
    env = onset_env / (onset_env.max() + 1e-9)
    env = env - np.median(env)  # reward onsets, penalize beats on silence
    n = len(env)
    best = (-np.inf, tempo, 0.0)
    for bpm in np.arange(tempo * 0.97, tempo * 1.03, tempo * 0.0005):
        period = 60.0 / bpm * fps  # frames
        n_beats = int((n - 1) / period)
        k = np.arange(n_beats)
        for phase in np.arange(0.0, period, 0.5):
            pos = phase + k * period
            idx = np.clip(np.round(pos).astype(int), 0, n - 1)
            sc = env[idx].mean()
            if sc > best[0]:
                best = (sc, bpm, phase)
    _, bpm, phase = best
    period = 60.0 / bpm
    first = phase / fps
    return bpm, np.arange(first, duration, period)


def estimate_key(chroma: np.ndarray):
    """Returns (tonic pitch class, is minor, key signature in fifths)."""
    prof = chroma.mean(axis=1)
    best = (-2.0, 0, False)
    for tonic in range(12):
        for minor, base in ((False, KS_MAJOR), (True, KS_MINOR)):
            corr = np.corrcoef(np.roll(base, tonic), prof)[0, 1]
            if corr > best[0]:
                best = (corr, tonic, minor)
    _, tonic, minor = best
    major_pc = (tonic + 3) % 12 if minor else tonic
    fifths = (major_pc * 7) % 12
    if fifths > 6:
        fifths -= 12
    return tonic, minor, fifths


def key_from_chords(chords, fallback_fifths: int):
    """Key signature (fifths) and mode from a chord sequence.

    Scores each major key by the chords that are diatonic to it, ties and
    ambiguities are resolved with the chroma based estimate.
    """
    counts = np.zeros((12, 2))
    for c in chords:
        if c is not None and c.kind in (0, 1, 2, 3, 4):
            counts[c.root, 1 if c.kind in (1, 3) else 0] += 1
    diatonic = [(0, 0), (2, 1), (4, 1), (5, 0), (7, 0), (9, 1)]
    best, best_score = fallback_fifths, -1.0
    fallback_pc = (fallback_fifths * 7) % 12
    for major_pc in range(12):
        score = sum(counts[(major_pc + off) % 12, q] for off, q in diatonic)
        # tonic / dominant / subdominant carry more weight
        score += 0.5 * sum(counts[(major_pc + off) % 12, q] for off, q in ((0, 0), (7, 0), (5, 0), (9, 1)))
        if major_pc == fallback_pc:
            score += 0.5
        if score > best_score:
            best_score, best = score, major_pc
    fifths = (best * 7) % 12
    if fifths > 6:
        fifths -= 12
    minor = counts[(best + 9) % 12, 1] > counts[best, 0]
    return fifths, bool(minor)


def chroma_novelty(chroma: np.ndarray, window_sec: float = 0.25):
    """How much the harmony changes at each frame (cosine distance of the
    mean chroma before and after the frame)."""
    fps = SR / HOP
    w = int(window_sec * fps)
    cs = np.cumsum(np.pad(chroma, ((0, 0), (1, 0))), axis=1)
    nov = np.zeros(chroma.shape[1])
    for i in range(w, chroma.shape[1] - w):
        a = (cs[:, i] - cs[:, i - w]) / w
        b = (cs[:, i + w] - cs[:, i]) / w
        nov[i] = 1 - np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-9)
    return nov


def beat_sync(chroma: np.ndarray, beat_frames: np.ndarray) -> np.ndarray:
    """Mean chroma per beat; column i covers beat i (up to the next beat)."""
    n = chroma.shape[1]
    bounds = list(np.clip(beat_frames, 0, n - 1)) + [n]
    cols = []
    for i in range(len(beat_frames)):
        lo, hi = bounds[i], max(bounds[i + 1], bounds[i] + 1)
        cols.append(chroma[:, lo:hi].mean(axis=1))
    return np.array(cols).T


def detect_chords(
    beat_chroma: np.ndarray,
    bass_chroma: np.ndarray | None,
    fifths: int | None,
    phase: int,
    bpb: int,
    bass_weight: float | None = None,
):
    """Chord per beat: template matching + bar-aware, key-aware Viterbi.

    Chords are expected to change mostly on the downbeat, less often in the
    middle of the bar and rarely elsewhere. Diatonic chords are preferred.
    """
    emission_scale = TUNING["emission_scale"]
    if bass_weight is None:
        bass_weight = TUNING["bass_weight"]
    states = []
    templates = []
    biases = []
    roots = []
    for k, (_, _, ivs, bias) in enumerate(CHORD_KINDS):
        for root in range(12):
            t = np.zeros(12)
            for iv in ivs:
                t[(root + iv) % 12] = 1.0
            templates.append(t / np.linalg.norm(t))
            biases.append(bias)
            roots.append(root)
            states.append(Chord(root, k))
    templ = np.array(templates)  # (states, 12)
    n_states = len(states)
    norm = np.linalg.norm(beat_chroma, axis=0, keepdims=True)
    unit = beat_chroma / np.maximum(norm, 1e-9)
    sim = templ @ unit + np.array(biases)[:, None]  # (states, beats)
    if bass_chroma is not None:
        bass = bass_chroma / np.maximum(bass_chroma.max(axis=0, keepdims=True), 1e-9)
        sim = sim + bass_weight * bass[np.array(roots), :]
    log_emis = emission_scale * sim

    # Prior for chord changes: favor chords of the key
    major_pc = ((fifths or 0) * 7) % 12
    scale = {(major_pc + iv) % 12 for iv in (0, 2, 4, 5, 7, 9, 11)}
    diatonic_triads = {  # (degree offset from major_pc, kind index)
        (0, 0), (2, 1), (4, 1), (5, 0), (7, 0), (9, 1),
    }
    weight = np.empty(n_states)
    for i, c in enumerate(states):
        rel = (c.root - major_pc) % 12
        if (rel, c.kind) in diatonic_triads:
            weight[i] = TUNING["w_diatonic"]
        elif c.root in scale and c.kind in (0, 1):
            weight[i] = TUNING["w_scale"]
        elif c.root in scale:
            weight[i] = TUNING["w_seventh"]  # 7th chords on scale degrees
        else:
            weight[i] = TUNING["w_chromatic"]
    if fifths is None:  # no key known: no preference
        weight = np.ones(n_states)
    log_w = np.log(weight / weight.sum())

    n_beats = beat_chroma.shape[1]
    delta = log_emis[:, 0] + log_w
    back = np.zeros((n_beats, n_states), dtype=int)
    for t in range(1, n_beats):
        pos = (t - phase) % bpb
        if pos == 0:
            p_change = TUNING["p_down"]
        elif bpb % 2 == 0 and pos == bpb // 2:
            p_change = TUNING["p_mid"]
        else:
            p_change = TUNING["p_other"]
        stay = delta + np.log(1 - p_change)
        best_prev = int(np.argmax(delta))
        change = delta[best_prev] + np.log(p_change) + log_w
        take_change = change > stay
        back[t] = np.where(take_change, best_prev, np.arange(n_states))
        delta = np.where(take_change, change, stay) + log_emis[:, t]
    path = np.zeros(n_beats, dtype=int)
    path[-1] = int(np.argmax(delta))
    for t in range(n_beats - 1, 0, -1):
        path[t - 1] = back[t, path[t]]
    return [states[i] for i in path], float(delta.max())


def estimate_downbeat_phase(
    beat_chroma: np.ndarray, onset_env: np.ndarray, beat_frames: np.ndarray, bpb: int
) -> int:
    """Pick the beat phase where chord changes and onsets concentrate."""
    n = beat_chroma.shape[1]
    unit = beat_chroma / np.maximum(np.linalg.norm(beat_chroma, axis=0, keepdims=True), 1e-9)
    change = np.zeros(n)
    change[1:] = 1.0 - np.sum(unit[:, 1:] * unit[:, :-1], axis=0)
    onset = onset_env[np.minimum(beat_frames[:n], len(onset_env) - 1)]
    onset = onset / (onset.max() + 1e-9)
    score = change / (change.max() + 1e-9) + 0.5 * onset
    totals = [score[p::bpb].mean() for p in range(bpb)]
    return int(np.argmax(totals))


def beat_position(t, beat_times: np.ndarray) -> np.ndarray:
    """Maps seconds to (fractional) beat index, extrapolating at both ends."""
    t = np.asarray(t, dtype=float)
    pos = np.interp(t, beat_times, np.arange(len(beat_times)))
    first = np.median(np.diff(beat_times[:8]))
    last = np.median(np.diff(beat_times[-8:]))
    pos = np.where(t < beat_times[0], (t - beat_times[0]) / first, pos)
    pos = np.where(
        t > beat_times[-1], len(beat_times) - 1 + (t - beat_times[-1]) / last, pos
    )
    return pos


MAJOR_SCALE = (0, 2, 4, 5, 7, 9, 11)


def snap_to_key(notes, fifths: int, chord_at=None):
    """Snaps out-of-key notes to the nearest allowed pitch class.

    Allowed are the scale tones of the key and the tones of the chord that is
    playing at the start of the note (`chord_at(seconds)` -> Chord or None).
    Out-of-key notes are most likely pitch tracking / singing inaccuracies.
    """
    major_pc = (fifths * 7) % 12
    scale = {(major_pc + iv) % 12 for iv in MAJOR_SCALE}
    for n in notes:
        allowed = set(scale)
        chord = chord_at(n.start) if chord_at is not None else None
        if chord is not None:
            allowed |= {(chord.root + iv) % 12 for iv in CHORD_KINDS[chord.kind][2]}
        if n.midi % 12 in allowed:
            continue
        cands = [m for m in range(n.midi - 2, n.midi + 3) if m % 12 in allowed]
        n.midi = min(cands, key=lambda m: abs(m - n.midi_f))
    return notes


def center_octave(notes, center: int = 66):
    """Shifts the melody by whole octaves into a comfortable treble clef range.

    Low (e.g. male) voices are written an octave higher, as usual in lead sheets.
    """
    if not notes:
        return notes
    shift = 12 * round((center - float(np.median([n.midi for n in notes]))) / 12)
    for n in notes:
        n.midi += shift
        n.midi_f += shift
    return notes


def _gate(midi: np.ndarray, y: np.ndarray, frame_sec: float, gate_db: float):
    """Removes frames that are (nearly) silent relative to the loudest parts."""
    hop = int(round(frame_sec * SR))
    rms = librosa.feature.rms(y=y, frame_length=2 * hop, hop_length=hop)[0]
    db = 20 * np.log10(rms + 1e-9)
    db = np.interp(np.arange(len(midi)), np.arange(len(db)), db)
    midi[db < np.percentile(db, 99) - gate_db] = np.nan
    return midi


def track_pitch_pyin(y: np.ndarray, fmin="C3", fmax="C6"):
    """Frame-wise pitch (MIDI) and voicing probability with pYIN."""
    f0, _, prob = librosa.pyin(
        y,
        fmin=librosa.note_to_hz(fmin),
        fmax=librosa.note_to_hz(fmax),
        sr=SR,
        frame_length=2048,
        hop_length=HOP,
        fill_na=None,
    )
    return librosa.hz_to_midi(f0), prob, HOP / SR


def track_pitch_crepe(y: np.ndarray):
    """Frame-wise pitch (MIDI) and periodicity (confidence) with CREPE."""
    import torch
    import torchcrepe

    sr = 16000
    hop = 160  # 10 ms
    audio = torch.tensor(librosa.resample(y, orig_sr=SR, target_sr=sr))[None].float()
    device = "cuda" if torch.cuda.is_available() else "cpu"
    f0, per = torchcrepe.predict(
        audio, sr, hop, 65.0, 1100.0, model="full", batch_size=512, device=device,
        return_periodicity=True, decoder=torchcrepe.decode.viterbi,
    )
    return librosa.hz_to_midi(f0[0].cpu().numpy()), per[0].cpu().numpy(), hop / sr


def track_pitch(y: np.ndarray):
    """Raw pitch track of the (isolated) vocals: CREPE if available, else pYIN.

    Returns (midi, confidence, frame_sec); unvoiced frames are not removed yet.
    """
    try:
        return track_pitch_crepe(y)
    except ImportError:
        return track_pitch_pyin(y)


def voiced_pitch(y: np.ndarray, pitch):
    """Applies the voicing threshold and loudness gate to a raw pitch track."""
    midi, conf, frame_sec = pitch
    midi = midi.astype(float).copy()
    midi[conf < MELODY["periodicity"]] = np.nan
    return _gate(midi, y, frame_sec, MELODY["gate_db"])


def tuning_offset(midi: np.ndarray) -> float:
    """Deviation of the pitch track from A=440 in semitones (-0.5 .. 0.5)."""
    v = midi[~np.isnan(midi)]
    if len(v) == 0:
        return 0.0
    ang = 2 * np.pi * (v - np.round(v))
    return float(np.angle(np.mean(np.exp(1j * ang))) / (2 * np.pi))


def segment_notes(
    midi: np.ndarray,
    frame_sec: float,
    max_gap: float = 0.07,  # seconds of silence allowed within a note
    min_len: float = 0.09,  # shortest note in seconds
    split_semitones: float = 0.75,
    merge_gap: float = 0.0,  # merge equal pitches separated by less (seconds)
):
    """Segments a pitch track into notes."""
    times = np.arange(len(midi)) * frame_sec
    max_gap_f = max_gap / frame_sec
    min_frames = min_len / frame_sec
    notes = []
    cur = []
    cur_start = 0.0
    gap = 0
    last_t = 0.0

    def flush(end_t: float):
        nonlocal cur
        if len(cur) >= min_frames:
            med = float(np.median(cur))
            notes.append(Note(cur_start, end_t, int(round(med)), med))
        cur = []

    for t, m in zip(times, midi):
        if np.isnan(m):
            gap += 1
            if cur and gap > max_gap_f:
                flush(last_t)
            continue
        if cur and abs(m - np.median(cur[-int(0.18 / frame_sec):])) > split_semitones:
            flush(last_t)
        if not cur:
            cur_start = t
        cur.append(m)
        last_t = t + frame_sec
        gap = 0
    if cur:
        flush(last_t)

    if merge_gap > 0:
        merged = []
        for n in notes:
            if merged and n.midi == merged[-1].midi and n.start - merged[-1].end < merge_gap:
                merged[-1].end = n.end
            else:
                merged.append(n)
        notes = merged
    return notes


def fix_octave_jumps(notes, window: int = 3, max_dist: float = 3.0):
    """Moves notes that are an octave away from their neighbours back.

    Pitch trackers sometimes lock onto a harmonic or subharmonic for a note.
    """
    out = []
    for i, n in enumerate(notes):
        neigh = [
            notes[j].midi_f
            for j in range(max(0, i - window), min(len(notes), i + window + 1))
            if j != i and abs(notes[j].start - n.start) < 2.0
        ]
        if len(neigh) >= 2:
            med = float(np.median(neigh))
            if abs(n.midi_f - med) >= 8:
                shift = 12 * round((med - n.midi_f) / 12)
                if abs(n.midi_f + shift - med) <= max_dist:
                    n = Note(n.start, n.end, n.midi + shift, n.midi_f + shift)
        out.append(n)
    return out


def split_at_onsets(notes, onsets, margin: float = 0.08):
    """Splits notes at vocal onsets (repeated syllables on the same pitch)."""
    out = []
    for n in notes:
        cuts = [o for o in onsets if n.start + margin < o < n.end - margin]
        pts = [n.start, *cuts, n.end]
        for a, b in zip(pts[:-1], pts[1:]):
            out.append(Note(a, b, n.midi, n.midi_f))
    return out


def extract_melody(y_vocals: np.ndarray, pitch=None):
    """Monophonic melody tracking segmented into notes.

    `pitch` can hold a precomputed raw pitch track (see `track_pitch`).
    """
    from scipy.ndimage import median_filter

    pitch = pitch if pitch is not None else track_pitch(y_vocals)
    frame_sec = pitch[2]
    midi = voiced_pitch(y_vocals, pitch)
    if MELODY["correct_tuning"]:
        midi = midi - tuning_offset(midi)
    if MELODY["median"] > 1:
        smooth = median_filter(np.nan_to_num(midi, nan=-1.0), size=MELODY["median"])
        midi = np.where(smooth < 0, np.nan, smooth)
    notes = segment_notes(
        midi,
        frame_sec,
        max_gap=MELODY["max_gap"],
        min_len=MELODY["min_len"],
        split_semitones=MELODY["split_semitones"],
    )
    if MELODY["octave_fix"]:
        notes = fix_octave_jumps(notes)
    if not MELODY["onset_split"]:
        return notes
    env = librosa.onset.onset_strength(y=y_vocals, sr=SR, hop_length=HOP, aggregate=np.median)
    onsets = librosa.onset.onset_detect(
        onset_envelope=env, sr=SR, hop_length=HOP, delta=MELODY["onset_delta"], units="time"
    )
    return split_at_onsets(notes, onsets, MELODY["onset_margin"])


def _eighth_autocorr(onset_env: np.ndarray, times: np.ndarray, max_lag: int = 24):
    fr = np.clip(np.round(times * SR / HOP).astype(int), 1, len(onset_env) - 2)
    x = np.maximum(onset_env[fr - 1], np.maximum(onset_env[fr], onset_env[fr + 1]))
    x = x - x.mean()
    denom = np.mean(x * x) + 1e-12
    return {lag: float(np.mean(x[:-lag] * x[lag:]) / denom) for lag in range(1, max_lag + 1)}


def detect_compound(onset_env: np.ndarray, tempo: float, duration: float):
    """Checks whether the rhythm pulses every 3 eighths (6/8) instead of 2 or 4.

    Looks at the eighth note grid (twice the tracked tempo). Returns the grid
    (times) if compound, else None. Compound meters tracked at the dotted
    quarter level are not detected, use --meter 6/8 for those.
    """
    _, times = fit_constant_grid(onset_env, tempo * 2, duration)
    ac = _eighth_autocorr(onset_env, times)
    pulse3 = np.mean([ac[l] for l in (3, 9, 15, 21)])
    pulse2 = np.mean([ac[l] for l in (2, 4, 8, 10, 14, 16)])
    if pulse3 > 0.25 and pulse3 > 2 * max(pulse2, 0.02):
        return times
    return None


def detect_beats_per_bar(onset_env: np.ndarray, beat_times: np.ndarray) -> int:
    """3 or 4 beats per bar from the periodicity of the onsets at beat level."""
    fr = np.clip(np.round(beat_times * SR / HOP).astype(int), 1, len(onset_env) - 2)
    x = np.maximum(onset_env[fr - 1], np.maximum(onset_env[fr], onset_env[fr + 1]))
    x = x - x.mean()
    denom = np.mean(x * x) + 1e-12
    ac = {l: float(np.mean(x[:-l] * x[l:]) / denom) for l in range(1, 18)}
    three = np.mean([ac[3], ac[6], ac[9]])
    four = np.mean([ac[4], ac[8], ac[16]])
    return 3 if three > 1.3 * max(four, 0.02) and three > 0.1 else 4


def _parse_meter(meter: str):
    if meter == "auto":
        return None
    beats, beat_type = meter.split("/")
    return int(beats), int(beat_type)


def analyze(
    path: str,
    meter: str = "auto",
    separate: bool = True,
    constant_tempo: bool = True,
    downbeat_shift: int = 0,
    cache_dir=None,
    with_melody: bool = True,
) -> Analysis:
    y = load_audio(path)
    duration = len(y) / SR
    if separate:
        stems = _cached(
            cache_dir,
            path,
            "stems",
            lambda: dict(zip(("vocals", "accomp", "bass"), separate_vocals(path))),
        )
        vocals, accomp, bass = stems["vocals"], stems["accomp"], stems["bass"]
        n = len(y)
        vocals = librosa.util.fix_length(vocals, size=n)
        accomp = librosa.util.fix_length(accomp, size=n)
        bass = librosa.util.fix_length(bass, size=n)
    else:
        vocals, accomp, bass = None, y, None
    y_harm, y_perc = librosa.effects.hpss(y, margin=3.0)

    onset_env = librosa.onset.onset_strength(
        y=y_perc + 0.3 * y_harm, sr=SR, hop_length=HOP
    )
    tempo, beat_frames = librosa.beat.beat_track(
        onset_envelope=onset_env, sr=SR, hop_length=HOP, tightness=120
    )
    tempo = float(np.atleast_1d(tempo)[0])
    if constant_tempo:
        tempo, beat_times = fit_constant_grid(onset_env, tempo, duration)
    else:
        beat_times = librosa.frames_to_time(beat_frames, sr=SR, hop_length=HOP)

    # Meter and beat grid candidates: (beat times, beats per bar)
    wanted = _parse_meter(meter)
    eighths = None
    if wanted is None or wanted[1] == 8:
        eighths = detect_compound(onset_env, tempo, duration)
        if eighths is None and wanted is not None:
            eighths = fit_constant_grid(onset_env, tempo * 2, duration)[1]
    if eighths is not None:
        beats_per_bar = (wanted[0] // 3) if wanted else 2
        meter_t = (beats_per_bar * 3, 8)
        beat_div = 6
        candidates = [(eighths[o::3], beats_per_bar) for o in range(3)]
    else:
        beats_per_bar = wanted[0] if wanted else detect_beats_per_bar(onset_env, beat_times)
        meter_t = (beats_per_bar, 4)
        beat_div = 4
        candidates = [(beat_times, beats_per_bar)]

    # Chords and key from the harmonic part of the accompaniment (or the mix)
    def compute_chroma():
        out = {}
        acc_harm = librosa.effects.harmonic(accomp, margin=3.0)
        out["accomp"] = librosa.feature.chroma_cqt(y=acc_harm, sr=SR, hop_length=HOP)
        out["mix"] = librosa.feature.chroma_cqt(
            y=librosa.effects.harmonic(y, margin=3.0), sr=SR, hop_length=HOP
        )
        if bass is not None:
            out["bass"] = librosa.feature.chroma_cqt(
                y=bass, sr=SR, hop_length=HOP, fmin=librosa.note_to_hz("C1"), n_octaves=4
            )
        return out

    feats = _cached(cache_dir, path, "chroma" if separate else "chroma_nosep", compute_chroma)
    chroma = feats[TUNING["chroma_source"]] ** TUNING["chroma_power"]
    bass_c = feats.get("bass")
    _, minor, fifths = estimate_key(chroma)

    # Compound meter: the beat grid can start at any of the 3 eighths. Choose the
    # offset where the harmony changes at the beats.
    if len(candidates) > 1:
        nov = chroma_novelty(chroma)
        fps = SR / HOP

        def novelty_at(bt):
            idx = np.clip(np.round(bt * fps).astype(int), 2, len(nov) - 3)
            return float(np.mean([nov[i - 2 : i + 3].max() for i in idx]))

        candidates = [max(candidates, key=lambda c: novelty_at(c[0]))]

    # The downbeat phase is the one for which the bar-aware chord model fits best. The key is refined from the detected chords.
    best = None
    for bt, bpb in candidates:
        frames = np.round(bt * SR / HOP).astype(int)
        bc = beat_sync(chroma, frames)
        bass_chroma = beat_sync(bass_c, frames) if bass_c is not None else None
        for p in range(bpb):
            _, score = detect_chords(bc, bass_chroma, fifths, p, bpb)
            if best is None or score > best[0]:
                best = (score, bt, bpb, p, bc, bass_chroma)
    _, beat_times, beats_per_bar, phase, bc, bass_chroma = best
    phase = (phase + downbeat_shift) % beats_per_bar
    # (without bass evidence, which makes the key estimate less reliable)
    free_chords = detect_chords(bc, None, None, phase, beats_per_bar, 0.0)[0]
    fifths, minor = key_from_chords(free_chords, fifths)
    chords = detect_chords(bc, bass_chroma, fifths, phase, beats_per_bar)[0]

    if with_melody:
        sig = vocals if vocals is not None else y_harm
        pitch = _cached(
            cache_dir,
            path,
            "pitch2" if vocals is not None else "pitch2_nosep",
            lambda: dict(zip(("midi", "conf", "frame_sec"), track_pitch(sig))),
        )
        notes = extract_melody(
            sig, pitch=(pitch["midi"], pitch["conf"], float(pitch["frame_sec"]))
        )
        def chord_at(t):
            idx = int(np.floor(beat_position(t, beat_times)))
            return chords[idx] if 0 <= idx < len(chords) else None

        notes = snap_to_key(notes, fifths, chord_at)
        notes = center_octave(notes)
    else:
        notes = []
    return Analysis(
        duration=duration,
        tempo=60.0 / float(np.median(np.diff(beat_times))),
        beat_times=beat_times,
        downbeat_phase=phase,
        beats_per_bar=beats_per_bar,
        fifths=fifths,
        minor=minor,
        chords=chords + [None] * (len(beat_times) - len(chords)),
        notes=notes,
        meter=meter_t,
        beat_div=beat_div,
    )
