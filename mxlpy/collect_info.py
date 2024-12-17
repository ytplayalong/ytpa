"""Collection of information from MusicXML files."""

import json
import warnings
import xml.etree.ElementTree as ET
from pathlib import Path
from collections import OrderedDict

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
        part_id = part.attrib["id"]
        name = part.find("part-name").text
        if "drum" not in name.lower():
            used_part_ids.append(part_id)

    # Find source
    sources = root.findall(".//identification/source")
    assert len(sources) > 0, f"No source specified in {xml.name}"
    msc_score_id = sources[0].text.split("/")[-1]

    # Find keys, exclude drum parts
    all_keys = []
    for part_id in used_part_ids:
        part = root.find(f".//part[@id='{part_id}']")
        fifths = part.findall(".//fifths")
        all_keys += [int(fifth.text) for fifth in fifths]
    all_keys = _make_unique(all_keys)

    assert len(all_keys) > 0, f"Key must be set for {xml.name}"
    for key in all_keys:
        if key > 6 or key < -6:
            warnings.warn(f"Bad key signature {key} in {xml.name}")

    # Find all measures with time signatures
    times = []
    time_meas = root.findall(".//*/time/../..")
    meas_to_time_dict = {}
    for meas in time_meas:
        meas_number = int(meas.attrib["number"])
        time_el = meas.find("attributes").find("time")
        n_beats = int(time_el.find("beats").text)
        beat_type = int(time_el.find("beat-type").text)
        time_tuple = (n_beats, beat_type)
        times.append(time_tuple)
        meas_to_time_dict[meas_number] = time_tuple
    times = _make_unique(times)
    if len(times) == 0:
        warnings.warn(f"No time signature: {xml.name}")

    return {
        "keys": all_keys,
        "times": times,
        "source": msc_score_id,
        "meas_to_time": meas_to_time_dict,
    }


def _check_measure_map(
    meas_to_time: dict[int, tuple[int, int]], meas_map: dict[str, int]
):
    """Checks for time signature changes and updates the measure map.

    If a time signature change happens in a bar that is not
    annotated with a time, it will be computed (by linear interpolation)
    and added to the measure map.
    """
    curr_meas_to_sec_idx = 0

    sorted_meas_to_sec = list(sorted(meas_map.items(), key=lambda el: (el[1], el[0])))
    sorted_meas_to_time = list(sorted(meas_to_time.items()))

    meas_to_sec_size = len(sorted_meas_to_sec)

    while curr_meas_to_sec_idx < meas_to_sec_size - 1:
        curr_meas_to_sec = sorted_meas_to_sec[curr_meas_to_sec_idx]
        next_meas_to_sec = sorted_meas_to_sec[curr_meas_to_sec_idx + 1]

        # Current interval measure numbers
        curr_anchor = curr_meas_to_sec[1]
        next_anchor = next_meas_to_sec[1]

        prev_time_sig = None
        prev_time_sig_measure_idx = -1
        required_time_sigs = []
        for meas_idx, time_sig in sorted_meas_to_time + [(next_anchor, [0, 0])]:
            if meas_idx <= curr_anchor:
                prev_time_sig_measure_idx = curr_anchor
                prev_time_sig = time_sig

            if curr_anchor < meas_idx < next_anchor:
                weight = (
                    (meas_idx - prev_time_sig_measure_idx)
                    * prev_time_sig[0]
                    / prev_time_sig[1]
                )
                required_time_sigs.append((meas_idx, weight))
                prev_time_sig_measure_idx = meas_idx
                prev_time_sig = time_sig
            if meas_idx >= next_anchor and prev_time_sig is not None:
                weight = (
                    (next_anchor - prev_time_sig_measure_idx)
                    * prev_time_sig[0]
                    / prev_time_sig[1]
                )
                required_time_sigs.append((next_anchor, weight))
                break

        if len(required_time_sigs) > 1:
            cum_weight_sum = 0
            end_sec = float(next_meas_to_sec[0])
            start_sec = float(curr_meas_to_sec[0])
            tot_len_s = end_sec - start_sec
            weight_sum = sum(el[1] for el in required_time_sigs)
            for el in required_time_sigs[:-1]:
                curr_weight = el[1]
                cum_weight_sum += curr_weight
                assert cum_weight_sum <= weight_sum
                sec = start_sec + cum_weight_sum * tot_len_s / weight_sum
                meas_map[f"{sec:.2f}"] = el[0]

        curr_meas_to_sec_idx += 1

    # Order dict to get consistent JSON
    entries = list(sorted(meas_map.items(), key=lambda el: el[1]))
    new_meas_map = OrderedDict(entries)

    all_sorted = all(
        float(entries[i][0]) <= float(entries[i + 1][0])
        for i in range(len(entries) - 1)
    )
    assert all_sorted, "Algorithm is flawed!"

    return new_meas_map


def extract_all_information():
    """Collect information from all scores in the given list."""

    score_info = Paths.read_score_info(exclude_privates=True)

    generated_info: list[dict] = []
    yt_xml_dir = Paths.XML_SCORES_PATH
    for score in tqdm(score_info):
        file_name = score["fileName"]

        file_path = yt_xml_dir / f"{file_name}.musicxml"
        auto_extracted = extract_auto_info(file_path)
        if auto_extracted:
            meas_to_time = auto_extracted.pop("meas_to_time")
            if len(meas_to_time) > 1:
                meas_map = score["measureMap"]
                score["measureMap"] = _check_measure_map(meas_to_time, meas_map)
            generated_info.append({**auto_extracted, **score})
        else:
            print(f"Did not find file {file_name}")

    _write_generated(generated_info)


def extract_auto_info(score_path: Path):
    """Automatically extracts information from mscz files.

    Also checks the path name's capitalization.
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
    _write_score_file(info)

    all_time_signatures = set()
    for score_info in info:
        for ts in score_info["times"]:
            all_time_signatures.add(tuple(ts))
    sorted_times = list(sorted(all_time_signatures))
    write_json(Paths.TIME_SIGNATURES_FILE, sorted_times)


def _write_score_file(info: list[dict]):
    """Write the score JSON with custom indentation.

    Only adds indentation up to the second level.
    """
    indent = "  "
    json_dict_strings = []
    for item in info:
        score_dict_list = []
        for k, v in item.items():
            dumped = json.dumps(v, ensure_ascii=False)
            entry = f'{indent}{indent}"{k}": {dumped}'
            score_dict_list.append(entry)
        all_item_string = ",\n".join(score_dict_list)
        json_string = f"{indent}{{\n{all_item_string}\n{indent}}}"
        json_dict_strings.append(json_string)

    json_string = ",\n".join(json_dict_strings)
    json_list = f"[\n{json_string}\n]\n"
    with open(Paths.GENERATED_SCORE_INFO_FILE, "w", encoding="UTF-8") as f:
        f.write(json_list)
