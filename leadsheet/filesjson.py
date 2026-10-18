"""Adds / updates the entry of a generated score in files.json.

files.json is the input of the export pipeline (export.py): the generated
MusicXML is converted to .mscz for the manual review, and the info of this
file (YouTube id, sync info, title, ...) is used afterwards.

The file is edited as text so that the formatting of the other 700+ entries
stays untouched (the diff only shows the new / changed entry).
"""

import json
import re
from pathlib import Path

DEFAULT_PATH = Path(__file__).resolve().parent.parent / "files.json"
MAX_ONE_LINE = 60  # shorter measure maps are written in one line


def video_id_from_name(path: Path) -> str | None:
    """YouTube id from a file name like 'Song [k6bHErrAel4].mp3' (yt-dlp)."""
    m = re.search(r"\[([\w-]{11})\]\s*$", path.stem)
    return m.group(1) if m else None


def _measure_map_text(measure_map: dict, indent: str) -> str:
    items = [f'"{k}": {v}' for k, v in measure_map.items()]
    one_line = "{ " + ", ".join(items) + " }"
    if len(one_line) <= MAX_ONE_LINE:
        return one_line
    inner = ",\n".join(f"{indent}  {it}" for it in items)
    return "{\n" + inner + f"\n{indent}}}"


def _entry_text(entry: dict) -> str:
    ind = "    "
    lines = [
        f'{ind}"videoId": {json.dumps(entry["videoId"])}',
        f'{ind}"measureMap": {_measure_map_text(entry["measureMap"], ind)}',
        f'{ind}"fileName": {json.dumps(entry["fileName"], ensure_ascii=False)}',
        f'{ind}"name": {json.dumps(entry["name"], ensure_ascii=False)}',
        f'{ind}"artist": {json.dumps(entry["artist"], ensure_ascii=False)}',
        f'{ind}"language": {json.dumps(entry["language"], ensure_ascii=False)}',
    ]
    return "  {\n" + ",\n".join(lines) + "\n  }"


def _write(path: Path, text: str):
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(text)


def update_files_json(
    file_name: str,
    measure_map: dict,
    title: str,
    artist: str | None,
    video_id: str | None,
    language: str | None,
    path: Path = DEFAULT_PATH,
) -> str:
    """Updates the entry with the given fileName or appends a new one.

    For an existing entry only the sync info (measureMap) is replaced, and
    name / artist / videoId / language if they are given explicitly.
    Returns a short description of what was done.
    """
    with open(path, encoding="utf-8", newline="") as f:  # keep line endings
        text = f.read()
    eol = "\r\n" if "\r\n" in text else "\n"
    entries = json.loads(text)
    existing = next((e for e in entries if e["fileName"] == file_name), None)

    if existing is None:
        entry = {
            "videoId": video_id or "",
            "measureMap": measure_map,
            "fileName": file_name,
            "name": title,
            "artist": artist or "",
            "language": language or "english",
        }
        end = text.rstrip().rfind("]")
        body = text[:end].rstrip()
        new_text = body + "," + eol + _entry_text(entry).replace("\n", eol) + eol + "]"
        new_text += text[text.rstrip().rfind("]") + 1 :]
        _write(path, new_text)
        note = f"Added {file_name} to {path.name}"
        if not video_id:
            note += " (no YouTube id, set it with --video-id!)"
        if not language:
            note += " (language set to 'english', change it with --language)"
        return note

    # Existing entry: replace the measureMap (and explicitly given fields)
    start = text.index(f'"fileName": {json.dumps(file_name, ensure_ascii=False)}')
    obj_start = text.rfind("\n  {", 0, start) + 1  # start of the entry object
    obj_end = text.index("\n  }", start) + 4
    block = text[obj_start:obj_end]
    new_block = re.sub(
        r'("measureMap":\s*)\{[^}]*\}',
        lambda m: m.group(1) + _measure_map_text(measure_map, "    ").replace("\n", eol),
        block,
        count=1,
    )
    for key, value in (
        ("videoId", video_id),
        ("name", title),
        ("artist", artist),
        ("language", language),
    ):
        if value:
            new_block = re.sub(
                rf'("{key}":\s*)"[^"]*"',
                lambda m, v=value: m.group(1) + json.dumps(v, ensure_ascii=False),
                new_block,
                count=1,
            )
    _write(path, text[:obj_start] + new_block + text[obj_end:])
    return f"Updated the entry of {file_name} in {path.name}"
