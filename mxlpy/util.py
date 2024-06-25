"""MusicXML utility module."""

import json
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any


class Paths:
    """Static class holding some paths."""

    MUSESCORE_EXE_PATH = Path("C:/Program Files/MuseScore 3/bin/MuseScore3.exe")
    COMPOSITIONS_PATH = Path("C:/Users/Chrigi/Documents/GitHub/compositions")
    MSCZ_SCORE_PATH = COMPOSITIONS_PATH / "PlayAlong"

    MXLPY_PATH = Path(__file__).parent.resolve()
    YTPA_BASE_PATH = MXLPY_PATH.parent
    NEXT_PROJECT_PATH = YTPA_BASE_PATH / "next"
    PUBLIC_PATH = NEXT_PROJECT_PATH / "public"
    XML_SCORES_PATH = PUBLIC_PATH / "mxl"

    NEXT_APP_PATH = NEXT_PROJECT_PATH / "app"
    GENERATED_SCORE_INFO_FILE = NEXT_APP_PATH / "scores.json"
    TIME_SIGNATURES_FILE = NEXT_APP_PATH / "timeSignatures.json"

    SCORE_INFO_FILE = YTPA_BASE_PATH / "files.json"

    assert MSCZ_SCORE_PATH.exists, f"Score directory {MSCZ_SCORE_PATH} not found!"
    assert MUSESCORE_EXE_PATH.exists(), f"Musescore not found at {MUSESCORE_EXE_PATH}!"
    assert XML_SCORES_PATH, f"XML output dir {XML_SCORES_PATH} does not exist!"


XML_DEC = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
"""


def write_xml(tree: ET, out_path: Path) -> None:
    with open(out_path, "wb") as f:
        f.write(XML_DEC.encode("UTF-8"))
        tree.write(f, encoding="UTF-8")


def read_json(p: Path):
    """Read data from JSON."""
    with open(p, "r", encoding="UTF-8") as f:
        return json.load(f)


def write_json(p: Path, data: Any, **kwargs) -> None:
    """Write data to JSON."""
    with open(p, "w", encoding="UTF-8") as f:
        json.dump(data, f, **kwargs, ensure_ascii=False)
