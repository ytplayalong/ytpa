"""Module for cleanup of MusicXML files."""

import xml.etree.ElementTree as ET
from pathlib import Path

from mxlpy.util import write_xml

# "type" is needed for small notes
# "beam" are used and not generated automatically
REMOVE_ELEMENTS = [
    "defaults",
    "credit",
    "print",
    "work",
    "midi-device",
    "midi-instrument",
    "encoding-date",
    "sound",
    "voice",
    "stem",
]
REMOVE_ATRS = ["default-x", "default-y", "width", "relative-y"]


def reduce_file(path: Path) -> None:
    """Removes some unneeded tags from the xml."""

    tree = ET.parse(path)
    root = tree.getroot()
    for el_name in REMOVE_ELEMENTS:
        for el in root.findall(f".//*/..[{el_name}]"):
            for sub_el in el.findall(el_name):
                el.remove(sub_el)

    for attr_name in REMOVE_ATRS:
        for el in root.findall(f".//*[@{attr_name}]"):
            el.attrib.pop(attr_name)

    # Overwrite file with reduced version
    write_xml(tree, path)
