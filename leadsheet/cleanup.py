"""MusicXML cleanup: merges tied notes, (re)creates beams and replaces empty
bars by whole measure rests.

Works on the generated lead sheets, but also on other simple single-voice
MusicXML files.

Usage: python -m leadsheet.cleanup in.musicxml [-o out.musicxml]
"""

import argparse
import xml.etree.ElementTree as ET
from pathlib import Path

# Duration in quarter notes -> (note type, number of dots)
_TYPES = {
    4.0: ("whole", 0),
    3.0: ("half", 1),
    2.0: ("half", 0),
    1.5: ("quarter", 1),
    1.0: ("quarter", 0),
    0.75: ("eighth", 1),
    0.5: ("eighth", 0),
    0.375: ("16th", 1),
    0.25: ("16th", 0),
    0.1875: ("32nd", 1),
    0.125: ("32nd", 0),
}
_BEAM_LEVEL = {"eighth": 1, "16th": 2, "32nd": 3}


def _notation_for(duration: int, divisions: int):
    return _TYPES.get(round(duration / divisions, 4))


def _is_pitched(note: ET.Element) -> bool:
    return note.find("pitch") is not None and note.find("chord") is None


def _pitch_key(note: ET.Element):
    p = note.find("pitch")
    if p is None:
        return None
    alter = p.findtext("alter") or "0"
    return (p.findtext("step"), int(float(alter)), p.findtext("octave"))


def _tie_types(note: ET.Element) -> set[str]:
    return {t.get("type") for t in note.findall("tie")}


def _set_ties(note: ET.Element, stop: bool, start: bool):
    """Rewrites <tie> and <tied> elements of the note."""
    for t in note.findall("tie"):
        note.remove(t)
    notations = note.find("notations")
    if notations is not None:
        for t in notations.findall("tied"):
            notations.remove(t)

    dur = note.find("duration")
    insert_at = list(note).index(dur) + 1
    for typ in [x for x, on in (("stop", stop), ("start", start)) if on]:
        el = ET.Element("tie", type=typ)
        note.insert(insert_at, el)
        insert_at += 1
    if (stop or start) and notations is None:
        notations = ET.SubElement(note, "notations")
    if notations is not None:
        for typ in [x for x, on in (("stop", stop), ("start", start)) if on]:
            notations.insert(0, ET.Element("tied", type=typ))
        if len(notations) == 0:
            note.remove(notations)


def _set_type(note: ET.Element, ntype: str, dots: int):
    for d in note.findall("dot"):
        note.remove(d)
    type_el = note.find("type")
    if type_el is None:
        type_el = ET.Element("type")
        note.insert(list(note).index(note.find("duration")) + 1, type_el)
    type_el.text = ntype
    idx = list(note).index(type_el) + 1
    for _ in range(dots):
        note.insert(idx, ET.Element("dot"))


def merge_ties(measure: ET.Element, divisions: int) -> int:
    """Merges directly adjacent tied notes of one measure. Returns #merges."""
    merges = 0
    changed = True
    while changed:
        changed = False
        children = list(measure)
        for i in range(len(children) - 1):
            a, b = children[i], children[i + 1]
            if a.tag != "note" or b.tag != "note":
                continue  # e.g. a chord symbol in between: keep the tie
            if not (_is_pitched(a) and _is_pitched(b)):
                continue
            if "start" not in _tie_types(a) or "stop" not in _tie_types(b):
                continue
            if _pitch_key(a) != _pitch_key(b):
                continue
            total = int(a.findtext("duration")) + int(b.findtext("duration"))
            notation = _notation_for(total, divisions)
            if notation is None:
                continue
            a.find("duration").text = str(total)
            _set_type(a, *notation)
            _set_ties(a, stop="stop" in _tie_types(a), start="start" in _tie_types(b))
            measure.remove(b)
            merges += 1
            changed = True
            break
    return merges


def _beat_length(divisions: int, beats: int, beat_type: int) -> int:
    if beat_type == 8 and beats % 3 == 0:
        return divisions * 3 // 2  # compound meter, dotted quarter beat
    return divisions * 4 // beat_type


def add_beams(measure: ET.Element, divisions: int, beat_len: int):
    """Removes existing beams and beams eighth/16th notes within a beat."""
    if measure.find("backup") is not None or measure.find("forward") is not None:
        return
    for note in measure.findall("note"):
        for beam in note.findall("beam"):
            note.remove(beam)

    groups: list[list[ET.Element]] = []
    cur: list[ET.Element] = []
    cur_beat = None
    pos = 0
    for note in measure.findall("note"):
        dur = int(note.findtext("duration") or 0)
        level = _BEAM_LEVEL.get(note.findtext("type", ""), 0)
        if note.find("rest") is None and level and note.find("chord") is None:
            beat = pos // beat_len
            if beat != cur_beat and cur:
                groups.append(cur)
                cur = []
            cur_beat = beat
            cur.append(note)
        else:
            if cur:
                groups.append(cur)
            cur, cur_beat = [], None
        pos += dur
    if cur:
        groups.append(cur)

    for group in groups:
        if len(group) < 2:
            continue
        levels = [_BEAM_LEVEL[n.findtext("type")] for n in group]
        for lvl in range(1, max(levels) + 1):
            i = 0
            while i < len(group):
                if levels[i] < lvl:
                    i += 1
                    continue
                j = i
                while j + 1 < len(group) and levels[j + 1] >= lvl:
                    j += 1
                if j > i:
                    for k in range(i, j + 1):
                        state = "begin" if k == i else "end" if k == j else "continue"
                        _add_beam(group[k], lvl, state)
                else:
                    state = "forward hook" if i == 0 else "backward hook"
                    _add_beam(group[i], lvl, state)
                i = j + 1


def _add_beam(note: ET.Element, level: int, state: str):
    el = ET.Element("beam", number=str(level))
    el.text = state
    children = list(note)
    after = [c for c in children if c.tag in ("notations", "lyric", "play")]
    idx = children.index(after[0]) if after else len(children)
    # keep beams ordered by level
    while idx > 0 and children[idx - 1].tag == "beam" and int(
        children[idx - 1].get("number")
    ) > level:
        idx -= 1
    note.insert(idx, el)


def whole_measure_rests(measure: ET.Element) -> bool:
    """Replaces a measure that only has rests by a single whole measure rest.

    Chord symbols inside such a measure are kept, positioned with <offset>.
    Returns True if the measure was changed.
    """
    allowed = {"attributes", "note", "harmony", "barline", "print"}
    children = list(measure)
    notes = [c for c in children if c.tag == "note"]
    if not notes or any(c.tag not in allowed for c in children):
        return False
    if any(n.find("rest") is None or n.find("chord") is not None for n in notes):
        return False
    if len(notes) == 1 and notes[0].find("rest").get("measure") == "yes":
        return False

    pos = 0
    harmonies = []
    for c in children:
        if c.tag == "note":
            pos += int(c.findtext("duration"))
        elif c.tag == "harmony":
            harmonies.append((pos, c))
    total = pos
    for c in notes + [h for _, h in harmonies]:
        measure.remove(c)
    insert_at = 0
    for i, c in enumerate(list(measure)):
        if c.tag in ("attributes", "print"):
            insert_at = i + 1
    for at, h in harmonies:
        for off in h.findall("offset"):
            h.remove(off)
        if at > 0:
            offset = ET.SubElement(h, "offset")
            offset.text = str(at)
            # <offset> follows <kind> (and inversion, bass, degree, frame)
            kinds = [i for i, e in enumerate(list(h)) if e.tag in ("kind", "inversion", "bass", "degree", "frame")]
            h.remove(offset)
            h.insert((kinds[-1] + 1) if kinds else len(h), offset)
        measure.insert(insert_at, h)
        insert_at += 1
    rest = ET.Element("note")
    ET.SubElement(rest, "rest", measure="yes")
    ET.SubElement(rest, "duration").text = str(total)
    measure.insert(insert_at, rest)
    return True


def cleanup_tree(root: ET.Element, merge: bool = True, beams: bool = True) -> int:
    """Cleans up all parts of a score-partwise tree. Returns #merged notes."""
    total = 0
    for part in root.findall("part"):
        divisions, beats, beat_type = 1, 4, 4
        for measure in part.findall("measure"):
            attrs = measure.find("attributes")
            if attrs is not None:
                if attrs.findtext("divisions"):
                    divisions = int(attrs.findtext("divisions"))
                time = attrs.find("time")
                if time is not None:
                    beats = int(time.findtext("beats"))
                    beat_type = int(time.findtext("beat-type"))
            if whole_measure_rests(measure):
                continue
            if merge:
                total += merge_ties(measure, divisions)
            if beams:
                add_beams(measure, divisions, _beat_length(divisions, beats, beat_type))
    return total


def main():
    parser = argparse.ArgumentParser(description="Merge tied notes and add beams.")
    parser.add_argument("src", type=Path)
    parser.add_argument("-o", "--out", type=Path, help="Default: overwrite the input")
    parser.add_argument("--no-merge", action="store_true")
    parser.add_argument("--no-beams", action="store_true")
    args = parser.parse_args()

    tree = ET.parse(args.src)
    n = cleanup_tree(tree.getroot(), not args.no_merge, not args.no_beams)
    ET.indent(tree)
    out = args.out or args.src
    tree.write(out, encoding="utf-8", xml_declaration=True)
    print(f"Merged {n} tied notes, wrote {out}")


if __name__ == "__main__":
    main()
