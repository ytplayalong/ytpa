"""Quantization of the analysis result and MusicXML / sync info output."""

import json
import xml.etree.ElementTree as ET
from dataclasses import dataclass

import numpy as np

from leadsheet.analysis import (
    CHORD_KINDS,
    NOTE_NAMES_FLAT,
    NOTE_NAMES_SHARP,
    Analysis,
    Chord,
    beat_position,
)

DIVISIONS = 4  # divisions per quarter note (16th grid)

# Allowed durations (in divisions) -> (note type, dots)
DURATIONS = {
    16: ("whole", 0),
    12: ("half", 1),
    8: ("half", 0),
    6: ("quarter", 1),
    4: ("quarter", 0),
    3: ("eighth", 1),
    2: ("eighth", 0),
    1: ("16th", 0),
}


@dataclass
class QNote:
    start: int  # in divisions from the first downbeat
    end: int
    midi: int


def _alignment_ok(length: int, pos: int, bar_len: int, compound: bool = False) -> bool:
    """Whether a note of `length` may start at `pos` (within the bar)."""
    if compound:  # e.g. 6/8, dotted quarter beats (6 divisions)
        if length == 12:
            return pos == 0
        if length == 6:
            return pos % 6 == 0
        if length == 4:
            return pos % 6 in (0, 2)
        if length in (8, 16):
            return False
        return pos % 2 == 0 if length in (3, 2) else True
    if length >= 12:
        return pos == 0 and bar_len >= length
    if length == 8:
        return pos % 8 == 0
    if length in (6, 4):
        return pos % 4 == 0
    if length in (3, 2):
        return pos % 2 == 0
    return True


def split_duration(
    pos: int,
    length: int,
    bar_len: int,
    allow_dots: bool = True,
    compound: bool = False,
) -> list[int]:
    """Splits `length` starting at `pos` in the bar into notatable pieces."""
    pieces = []
    while length > 0:
        for cand in sorted(DURATIONS, reverse=True):
            if not allow_dots and DURATIONS[cand][1]:
                continue
            if cand <= length and _alignment_ok(cand, pos, bar_len, compound):
                pieces.append(cand)
                pos += cand
                length -= cand
                break
    return pieces


def quantize(an: Analysis, grid: int, n_bars: int) -> list[QNote]:
    """Quantizes notes to the beat grid (positions in divisions from bar 1)."""
    beats = an.beat_times
    first_beat = an.downbeat_phase
    bpb = an.beats_per_bar
    bar_len = bpb * an.beat_div
    total = n_bars * bar_len
    out: list[QNote] = []
    for n in an.notes:
        s, e = beat_position([n.start, n.end], beats)
        s = (s - first_beat) * an.beat_div
        e = (e - first_beat) * an.beat_div
        qs = int(round(s / grid)) * grid
        qe = int(round(e / grid)) * grid
        if qe <= qs:
            qe = qs + grid
        if qe <= 0 or qs >= total:
            continue
        qs, qe = max(qs, 0), min(qe, total)
        if out:
            prev = out[-1]
            if qs < prev.end:
                prev.end = max(prev.start + grid, qs)  # no overlaps
                qs = max(qs, prev.end)
        if qe > qs:
            out.append(QNote(qs, qe, n.midi))
    return out


def pitch_spelling(midi: int, fifths: int) -> tuple[str, int, int]:
    names = NOTE_NAMES_SHARP if fifths >= 0 else NOTE_NAMES_FLAT
    name = names[midi % 12]
    step = name[0]
    alter = 1 if "#" in name else -1 if "b" in name else 0
    return step, alter, midi // 12 - 1


def _text(parent, tag, text):
    el = ET.SubElement(parent, tag)
    el.text = str(text)
    return el


def _harmony(measure, chord: Chord, fifths: int):
    names = NOTE_NAMES_SHARP if fifths >= 0 else NOTE_NAMES_FLAT
    name = names[chord.root]
    kind, suffix, _, _ = CHORD_KINDS[chord.kind]
    h = ET.SubElement(measure, "harmony")
    root = ET.SubElement(h, "root")
    _text(root, "root-step", name[0])
    if len(name) > 1:
        _text(root, "root-alter", 1 if name[1] == "#" else -1)
    k = _text(h, "kind", kind)
    k.set("text", suffix)


def _note(measure, midi: int | None, length: int, fifths: int, tie_start=False, tie_stop=False):
    note = ET.SubElement(measure, "note")
    if midi is None:
        ET.SubElement(note, "rest")
    else:
        step, alter, octave = pitch_spelling(midi, fifths)
        pitch = ET.SubElement(note, "pitch")
        _text(pitch, "step", step)
        if alter:
            _text(pitch, "alter", alter)
        _text(pitch, "octave", octave)
    _text(note, "duration", length)
    if tie_stop:
        ET.SubElement(note, "tie").set("type", "stop")
    if tie_start:
        ET.SubElement(note, "tie").set("type", "start")
    ntype, dots = DURATIONS[length]
    _text(note, "type", ntype)
    for _ in range(dots):
        ET.SubElement(note, "dot")
    if tie_start or tie_stop:
        notations = ET.SubElement(note, "notations")
        if tie_stop:
            ET.SubElement(notations, "tied").set("type", "stop")
        if tie_start:
            ET.SubElement(notations, "tied").set("type", "start")


def chord_changes(an: Analysis, n_bars: int) -> dict[int, Chord]:
    """Chord per position (divisions): only at changes, snapped to beats."""
    out: dict[int, Chord] = {}
    prev = None
    total_beats = n_bars * an.beats_per_bar
    for b in range(total_beats):
        idx = an.downbeat_phase + b
        if idx >= len(an.chords):
            break
        c = an.chords[idx]
        if c is None:
            continue
        if prev is None or (c.root, c.kind) != (prev.root, prev.kind):
            out[b * an.beat_div] = c
            prev = c
    return out


def bar_times(an: Analysis, n_bars: int) -> list[float]:
    """Start time (seconds) of each bar."""
    idx = an.downbeat_phase + np.arange(n_bars) * an.beats_per_bar
    idx = np.minimum(idx, len(an.beat_times) - 1)
    return [float(an.beat_times[i]) for i in idx]


def count_bars(an: Analysis) -> int:
    return (len(an.beat_times) - an.downbeat_phase) // an.beats_per_bar


RIGHTS = "Play-Along this score on YouTube on https://ytpa.ch"


def build_musicxml(
    an: Analysis, title: str, grid: int, artist: str | None = None
) -> ET.ElementTree:
    n_bars = count_bars(an)
    bpb = an.beats_per_bar
    bar_len = bpb * an.beat_div
    notes = quantize(an, grid, n_bars)
    chords = chord_changes(an, n_bars)

    root = ET.Element("score-partwise", version="3.1")
    work = ET.SubElement(root, "work")
    _text(work, "work-title", title)
    ident = ET.SubElement(root, "identification")
    if artist:
        _text(ident, "creator", artist).set("type", "composer")
    _text(ident, "rights", RIGHTS)
    plist = ET.SubElement(root, "part-list")
    sp = ET.SubElement(plist, "score-part", id="P1")
    # The part name is required but should not be shown as stave title
    ET.SubElement(sp, "part-name", {"print-object": "no"})
    part = ET.SubElement(root, "part", id="P1")

    for bar in range(n_bars):
        b0, b1 = bar * bar_len, (bar + 1) * bar_len
        m = ET.SubElement(part, "measure", number=str(bar + 1))
        if bar == 0:
            attrs = ET.SubElement(m, "attributes")
            _text(attrs, "divisions", DIVISIONS)
            key = ET.SubElement(attrs, "key")
            _text(key, "fifths", an.fifths)
            _text(key, "mode", "minor" if an.minor else "major")
            time = ET.SubElement(attrs, "time")
            _text(time, "beats", an.meter[0])
            _text(time, "beat-type", an.meter[1])
            clef = ET.SubElement(attrs, "clef")
            _text(clef, "sign", "G")
            _text(clef, "line", 2)

        # Events of this bar: (start, end, midi or None, tie_in, tie_out)
        events = []
        cursor = b0
        for n in notes:
            if n.end <= b0 or n.start >= b1:
                continue
            s = max(n.start, b0)
            if s > cursor:
                events.append((cursor, s, None, False, False))
            e = min(n.end, b1)
            events.append((s, e, n.midi, n.start < b0, n.end > b1))
            cursor = e
        if cursor < b1:
            events.append((cursor, b1, None, False, False))

        _emit_bar(m, events, chords, an.fifths, b0, bar_len, an.meter[1] == 8)
    return ET.ElementTree(root)


def _emit_bar(m, events, chords, fifths, b0, bar_len, compound=False):
    """Emits the events of a bar, cut at chord changes (joined by ties)."""
    cuts = sorted(p for p in chords if b0 <= p < b0 + bar_len)
    for s, e, midi, tie_in, tie_out in events:
        bounds = [s, *[c for c in cuts if s < c < e], e]
        for j in range(len(bounds) - 1):
            seg_s, seg_e = bounds[j], bounds[j + 1]
            ts = tie_in if j == 0 else True
            te = tie_out if j == len(bounds) - 2 else True
            if seg_s in chords:
                _harmony(m, chords[seg_s], fifths)
            pieces = split_duration(
                seg_s - b0,
                seg_e - seg_s,
                bar_len,
                allow_dots=midi is not None,
                compound=compound,
            )
            for k, p in enumerate(pieces):
                stop = ts if k == 0 else True
                start = te if k == len(pieces) - 1 else True
                has_pitch = midi is not None
                _note(m, midi, p, fifths, tie_start=start and has_pitch, tie_stop=stop and has_pitch)


def sync_info(an: Analysis, anchor_every: int = 4) -> dict:
    """Sync info in the `scores.json` format (seconds -> measure number)."""
    n_bars = count_bars(an)
    times = bar_times(an, n_bars)
    measure_map = {}
    for bar in range(0, n_bars, anchor_every):
        measure_map[f"{times[bar]:.1f}"] = bar + 1
    last = n_bars - 1
    if last % anchor_every:
        measure_map[f"{times[last]:.1f}"] = n_bars
    return {
        "keys": [an.fifths],
        "times": [list(an.meter)],
        "measureMap": measure_map,
    }


def file_stem(title: str, artist: str | None, out_dir) -> str:
    """File name for a title: spaces become underscores. If a file with that
    name exists already, the artist is added."""
    import re
    from pathlib import Path

    def clean(text: str) -> str:
        return re.sub(r"[^\w\-.()]+", "_", text.strip()).strip("_")

    stem = clean(title)
    if (Path(out_dir) / f"{stem}.musicxml").exists() and artist:
        stem = f"{stem}_{clean(artist)}"
    return stem


def write_outputs(
    an: Analysis,
    out_dir,
    title: str,
    grid: int | None = None,
    cleanup: bool = True,
    artist: str | None = None,
    stem: str | None = None,
):
    """Writes <stem>.musicxml and <stem>.json. `stem` defaults to the title with
    underscores instead of spaces (plus the artist if that file exists)."""
    from pathlib import Path

    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    if grid is None:
        grid = 2
    stem = stem or file_stem(title, artist, out_dir)
    tree = build_musicxml(an, title, grid, artist)
    if cleanup:
        from leadsheet.cleanup import cleanup_tree

        cleanup_tree(tree.getroot())
    ET.indent(tree)
    xml_path = out_dir / f"{stem}.musicxml"
    tree.write(xml_path, encoding="utf-8", xml_declaration=True)
    json_path = out_dir / f"{stem}.json"
    json_path.write_text(json.dumps(sync_info(an), indent=2), encoding="utf-8")
    return xml_path, json_path
