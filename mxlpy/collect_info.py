"""Collection of information from MusicXML files."""

import json
import warnings
import xml.etree.ElementTree as ET
from pathlib import Path

from tqdm import tqdm

from mxlpy.util import Paths, read_json, write_json


def _make_unique(inp: list) -> list:
    return list(set(inp))


def extract_info(xml: Path):
    """Extract information from the score."""
    tree = ET.parse(xml)
    root = tree.getroot()

    # Find all parts (excluding drum sets)
    score_parts = root.findall(".//score-part")
    used_part_ids = []
    for part in score_parts:
        id = part.attrib["id"]
        name = part.find("part-name").text
        if "drum" not in name.lower():
            used_part_ids.append(id)

    # Find source
    sources = root.findall(".//identification/source")
    assert len(sources) > 0, "No source specified!"
    msc_score_id = sources[0].text.split("/")[-1]

    # Find keys, exclude drum parts
    all_keys = []
    for part_id in used_part_ids:
        part = root.find(f".//part[@id='{part_id}']")
        fifths = part.findall(f".//fifths")
        all_keys += [int(fifth.text) for fifth in fifths]
    all_keys = _make_unique(all_keys)

    assert len(all_keys) > 0, f"Key must be set for {xml.name}"
    for key in all_keys:
        if key > 6 or key < -6:
            warnings.warn(f"Bad key signature {key} in {xml.name}")

    # Find time signatures
    times = []
    time_els = root.findall(".//*/time")
    for time_el in time_els:
        n_beats = int(time_el.find("beats").text)
        beat_type = int(time_el.find("beat-type").text)
        times.append((n_beats, beat_type))
    times = _make_unique(times)
    if len(times) == 0:
        warnings.warn(f"No time signature: {xml.name}")

    return {"keys": all_keys, "times": times, "source": msc_score_id}


def extract_all_information():
    """Collect information from all scores in the given list."""

    score_info = read_json(Paths.SCORE_INFO_FILE)

    generated_info: list[dict] = []
    yt_xml_dir = Paths.XML_SCORES_PATH
    for score in tqdm(score_info):
        file_name = score["fileName"]

        file_path = yt_xml_dir / f"{file_name}.musicxml"
        auto_extracted = extract_auto_info(file_path)
        if auto_extracted:
            generated_info.append({**auto_extracted, **score})
        else:
            print(f"Did not find file {file_name}")

    _write_generated(generated_info)


def extract_auto_info(score_path: Path):
    """Automatically extracts information from mscz files.

    Also checcks the path name's capitalization.
    """

    # Check file exists
    if not score_path.exists():
        return None

    # Check correct capitalization which is important on linux.
    actual_name = score_path.resolve().stem
    assert (
        actual_name == score_path.stem
    ), f"Score info: {score_path.stem}, should be {actual_name}"

    return extract_info(score_path)


def _write_generated(info: list[dict]) -> None:
    write_json(Paths.GENERATED_SCORE_INFO_FILE, info)

    all_time_signatures = set()
    for score_info in info:
        for ts in score_info["times"]:
            all_time_signatures.add(tuple(ts))
    sorted_times = list(sorted(all_time_signatures))
    write_json(Paths.TIME_SIGNATURES_FILE, sorted_times)
