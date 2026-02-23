"""MusicXML utility module."""

import os
import json
import unicodedata
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

import requests
from tqdm import tqdm


class Paths:
    """Static class holding some paths."""

    _home = Path.home()

    MUSESCORE_EXE_PATH = Path("C:/Program Files/MuseScore 4/bin/MuseScore4.exe")
    MUSESCORE3_EXE_PATH = Path("C:/Program Files/MuseScore 3/bin/MuseScore3.exe")
    COMPOSITIONS_PATH = _home / "Documents/GitHub/compositions"
    MSCZ_SCORE_PATH = COMPOSITIONS_PATH / "PlayAlong" / "Current"

    MXLPY_PATH = Path(__file__).parent.resolve()
    YTPA_BASE_PATH = MXLPY_PATH.parent
    NEXT_PROJECT_PATH = YTPA_BASE_PATH / "next"
    PUBLIC_PATH = NEXT_PROJECT_PATH / "public"
    XML_SCORES_PATH = PUBLIC_PATH / "mxl"

    NEXT_APP_PATH = NEXT_PROJECT_PATH / "app"
    GENERATED_SCORE_INFO_FILE = NEXT_APP_PATH / "scores.json"
    TIME_SIGNATURES_FILE = NEXT_APP_PATH / "timeSignatures.json"

    SCORE_INFO_FILE = YTPA_BASE_PATH / "files.json"
    PRIVATE_SCORES_FILE = YTPA_BASE_PATH / "private.json"

    assert MSCZ_SCORE_PATH.exists, f"Score directory {MSCZ_SCORE_PATH} not found!"
    assert XML_SCORES_PATH, f"XML output dir {XML_SCORES_PATH} does not exist!"

    @staticmethod
    def find_musescore_binary(version: int = 4):
        pth = os.environ.get("MS_EXPORT_PATH")
        if pth is not None:
            ms_pth = Path(pth).expanduser().resolve()
            if ms_pth.exists():
                print(f"Using ms from {ms_pth}")
                return ms_pth

        win_path_s = f"C:/Program Files/MuseScore {version}/bin/MuseScore{version}.exe"
        win_path = Path(win_path_s)
        if win_path.exists():
            return win_path
        
        snap_paht = Path("/snap/bin/musescore")
        if snap_paht.exists():
            return snap_paht
        
        raise FileNotFoundError("Did not find musescore executable.")

    @staticmethod
    def get_xml_path(score_info: dict):
        file_name = score_info["fileName"]
        return Paths.XML_SCORES_PATH / f"{file_name}.musicxml"

    @staticmethod
    def get_mscz_path(score_info: dict):
        file_name = score_info["fileName"]
        return Paths.MSCZ_SCORE_PATH / f"{file_name}.mscz"

    @staticmethod
    def find_all_scores(sort_by_modify_date: bool = False):
        all_paths = Paths.MSCZ_SCORE_PATH.rglob("*.mscz")
        if sort_by_modify_date:
            all_paths = sorted(
                all_paths, key=lambda p: p.lstat().st_mtime, reverse=True
            )
        return all_paths

    @staticmethod
    def read_generated_score_info() -> list[dict]:
        return read_json(Paths.GENERATED_SCORE_INFO_FILE)

    @staticmethod
    def read_score_info(exclude_privates: bool = False) -> list[dict]:
        all_scores = read_json(Paths.SCORE_INFO_FILE)
        if exclude_privates:
            excluded_ids = Paths.read_private_score_ids()
            all_scores = [sc for sc in all_scores if sc["videoId"] not in excluded_ids]

        return all_scores

    @staticmethod
    def read_private_score_ids():
        score_ids: list[str] = read_json(Paths.PRIVATE_SCORES_FILE)
        return set(score_ids)


XML_DEC = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
"""


def check_yt_available(video_id: str):
    url = f"https://img.youtube.com/vi/{video_id}/default.jpg"
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        return True
    elif r.status_code == 404:
        return False
    print(f"Unexpected status: {r.status_code}")
    return False


def check_all_yt_sources():
    """Check if all referenced YouTube videos are still available."""

    score_infos = Paths.read_generated_score_info()
    unavailable = []
    for score_info in tqdm(score_infos, desc="Checking YT sources"):
        if not check_yt_available(score_info["videoId"]):
            unavailable.append(score_info)

    n_unavailable = len(unavailable)
    if n_unavailable > 0:
        print(f"Found {n_unavailable} YouTube videos that are not available.")
        for score_info in unavailable:
            name, artist = score_info["name"], score_info["artist"]
            print(f" - {name} by {artist} (ID={score_info['videoId']})")
        print()
    return unavailable


def write_xml(tree: ET, out_path: Path) -> None:
    with open(out_path, "wb") as f:
        f.write(XML_DEC.encode("UTF-8"))
        tree.write(f, encoding="UTF-8")


def read_json(p: Path):
    """Read data from JSON."""
    with open(p, "r", encoding="UTF-8") as f:
        raw = f.read()

        # This fixes strange umlauts:
        normalized_raw = unicodedata.normalize("NFC", raw)
        return json.loads(normalized_raw)


def write_json(p: Path, data: Any, **kwargs) -> None:
    """Write data to JSON."""
    with open(p, "w", encoding="UTF-8") as f:
        json.dump(data, f, **kwargs, ensure_ascii=False)
