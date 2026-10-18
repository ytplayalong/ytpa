"""Compares generated lead sheets with hand made reference MusicXML files.

The bars of both scores are mapped to seconds (reference: via the anchors of
its `measureMap` in scores.json, generated: via its own beat grid), so the
comparison works independent of intros or different bar counts.

Usage: python -m leadsheet.evaluate generated.musicxml reference.musicxml \\
           generated_info.json reference_measure_map.json
(see leadsheet.benchmark for the batch version)
"""

import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

import numpy as np

STEPS = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


class Score:
    """Chords and notes of a MusicXML file, positions as (bar index, quarters)."""

    def __init__(self, path: Path):
        root = ET.parse(path).getroot()
        self.fifths = None
        self.meter = None
        self.bar_quarters: list[float] = []
        self.chords: list[tuple[int, float, tuple[int, bool]]] = []
        self.notes: list[tuple[int, float, int]] = []
        divisions, beats, beat_type = 1, 4, 4
        for bar, measure in enumerate(root.find("part").findall("measure")):
            attrs = measure.find("attributes")
            if attrs is not None:
                if attrs.findtext("divisions"):
                    divisions = int(attrs.findtext("divisions"))
                if attrs.find("time") is not None:
                    beats = int(attrs.find("time").findtext("beats"))
                    beat_type = int(attrs.find("time").findtext("beat-type"))
                    if self.meter is None:
                        self.meter = (beats, beat_type)
                if attrs.find("key") is not None and self.fifths is None:
                    self.fifths = int(attrs.find("key").findtext("fifths"))
            self.bar_quarters.append(beats * 4 / beat_type)
            pos = 0
            for el in measure:
                if el.tag == "harmony":
                    r = el.find("root")
                    pc = (STEPS[r.findtext("root-step")] + int(r.findtext("root-alter") or 0)) % 12
                    kind = el.find("kind").text or ""
                    off = int(el.findtext("offset") or 0)
                    self.chords.append(
                        (bar, (pos + off) / divisions, (pc, kind.startswith(("minor", "diminished"))))
                    )
                elif el.tag == "note" and el.find("chord") is None:
                    p = el.find("pitch")
                    tie_stop = any(t.get("type") == "stop" for t in el.findall("tie"))
                    if p is not None and not tie_stop:
                        midi = (
                            12 * (int(p.findtext("octave")) + 1)
                            + STEPS[p.findtext("step")]
                            + int(p.findtext("alter") or 0)
                        )
                        self.notes.append((bar, pos / divisions, midi))
                    pos += int(el.findtext("duration"))
                elif el.tag == "backup":
                    pos -= int(el.findtext("duration"))
                elif el.tag == "forward":
                    pos += int(el.findtext("duration"))

    def time_of(self, bar: int, quarters: float, bar_times: np.ndarray) -> float:
        """Seconds of a position, `bar_times[i]` is the start of bar i."""
        start = bar_times[bar]
        dur = bar_times[bar + 1] - start
        return float(start + dur * quarters / self.bar_quarters[bar])

    def chord_events(self, bar_times):
        return sorted(
            (self.time_of(b, q, bar_times), c) for b, q, c in self.chords
        )

    def note_events(self, bar_times):
        return sorted((self.time_of(b, q, bar_times), m) for b, q, m in self.notes)


def bar_times_from_measure_map(measure_map: dict, n_bars: int) -> np.ndarray:
    """Start times of the bars 0..n_bars (inclusive) from scores.json anchors."""
    pts = sorted((int(m), float(t)) for t, m in measure_map.items())
    ms = np.array([m for m, _ in pts], dtype=float)
    ts = np.array([t for _, t in pts])
    idx = np.arange(1, n_bars + 2, dtype=float)
    times = np.interp(idx, ms, ts)
    # linear extrapolation outside of the anchors
    if len(ms) >= 2:
        lo = idx < ms[0]
        hi = idx > ms[-1]
        times[lo] = ts[0] + (idx[lo] - ms[0]) * (ts[1] - ts[0]) / (ms[1] - ms[0])
        times[hi] = ts[-1] + (idx[hi] - ms[-1]) * (ts[-1] - ts[-2]) / (ms[-1] - ms[-2])
    return times


def _held(events, t):
    cur = None
    for et, c in events:
        if et <= t + 1e-6:
            cur = c
        else:
            break
    return cur


def align_reference(gen_notes, ref_notes, tol: float = 0.15):
    """Finds the time warp (scale, offset) of the reference that best matches
    the generated notes (compensates for coarse reference anchors).

    Returns (scale, offset, matches): ref_time' = scale * ref_time + offset.
    """
    g = np.array([t for t, _ in gen_notes])
    gp = np.array([m % 12 for _, m in gen_notes])
    r = np.array([t for t, _ in ref_notes])
    rp = np.array([m % 12 for _, m in ref_notes])
    if len(g) == 0 or len(r) == 0:
        return 1.0, 0.0, 0
    order = np.argsort(g)
    g, gp = g[order], gp[order]
    best = (-1, 1.0, 0.0)
    mid = float(np.median(r))
    for scale in np.arange(0.96, 1.04001, 0.002):
        for offset in np.arange(-2.0, 2.0001, 0.05):
            t = scale * (r - mid) + mid + offset
            idx = np.clip(np.searchsorted(g, t), 1, len(g) - 1)
            near = np.where(abs(g[idx - 1] - t) < abs(g[idx] - t), idx - 1, idx)
            ok = (abs(g[near] - t) <= tol) & (gp[near] == rp)
            n = int(ok.sum())
            if n > best[0]:
                best = (n, scale, offset)
    n, scale, offset = best
    # express as ref_time' = scale * ref_time + offset'
    return scale, offset + mid * (1 - scale), n


def compare(gen: Score, gen_bar_times, ref: Score, ref_bar_times, tol: float = 0.3, align: bool = True):
    """Chord and note accuracy of `gen` against `ref`."""
    if align:
        scale, offset, _ = align_reference(
            gen.note_events(gen_bar_times), ref.note_events(ref_bar_times)
        )
        ref_bar_times = scale * np.asarray(ref_bar_times) + offset
    gen_chords = gen.chord_events(gen_bar_times)
    ref_chords = ref.chord_events(ref_bar_times)
    root = full = tot = 0
    for bar in range(len(ref.bar_quarters)):
        n_beats = int(round(ref.bar_quarters[bar]))
        for beat in range(n_beats):
            t = ref.time_of(bar, beat + 0.5, ref_bar_times)
            rc = _held(ref_chords, t)
            gc = _held(gen_chords, t)
            if rc is None or gc is None:
                continue
            if t < gen_bar_times[0] or t > gen_bar_times[-1]:
                continue
            tot += 1
            root += gc[0] == rc[0]
            full += gc == rc
    ref_notes = ref.note_events(ref_bar_times)
    gen_notes = gen.note_events(gen_bar_times)
    # octave of the generated notes relative to the reference (most common)
    diffs = Counter()
    for t, m in ref_notes:
        for gt, gm in gen_notes:
            if abs(gt - t) <= tol:
                diffs[(gm - m) // 12] += 1
    shift = diffs.most_common(1)[0][0] if diffs else 0
    res = {}
    if tot:
        res = {"chord root": root / tot, "chord": full / tot}
    for name, exact in (("note pc", False), ("note", True)):
        used, hit = set(), 0
        for t, m in ref_notes:
            best = None
            for j, (gt, gm) in enumerate(gen_notes):
                if j in used or abs(gt - t) > tol:
                    continue
                ok = (gm - shift * 12 == m) if exact else ((gm - m) % 12 == 0)
                if ok and (best is None or abs(gt - t) < abs(gen_notes[best][0] - t)):
                    best = j
            if best is not None:
                used.add(best)
                hit += 1
        rec = hit / max(len(ref_notes), 1)
        prec = hit / max(len(gen_notes), 1)
        res[f"{name} recall"] = rec
        res[f"{name} precision"] = prec
    return res
