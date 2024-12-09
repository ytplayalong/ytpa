"""Python package for reading and modifying MuseScore .mscz files."""

import xml.etree.ElementTree as ET
from pathlib import Path
import zipfile
import os
import argparse


class MsczFileManager:
    """Read, modify and write compressed musescore files."""

    _path: Path
    _packed_xml_name: str | None = None
    _parsed_xml: ET.Element | None = None

    def __init__(self, path: Path):
        """Constructor."""
        self._path = path

    def read_mscz(self) -> ET.Element | None:
        """Read a file."""
        xml_data: bytes | None = None
        with zipfile.ZipFile(self._path, "r") as archive:
            for file in archive.filelist:
                if file.filename.endswith(".mscx"):
                    self._packed_xml_name = file.filename
                    xml_data = archive.read(file)
                    break
        if xml_data is None:
            return None

        self._parsed_xml = ET.fromstring(xml_data.decode())
        return self._parsed_xml

    def get_meta_tags(self):
        """Read meta tags from XML."""
        if self._parsed_xml is None:
            return None
        meta_tags = self._parsed_xml.findall(".//metaTag")
        tag_dict: dict[str, str | None] = {}
        for tag in meta_tags:
            name = tag.attrib["name"]
            text = tag.text
            tag_dict[name] = text
        return tag_dict

    def get_text(self):
        """Read text from boxes in XML."""
        vbox_texts = self._parsed_xml.findall(".//VBox/Text")
        out_dict: dict[str, str] = {}
        for tag in vbox_texts:
            style = tag.find("style").text
            text = tag.find("text").text
            out_dict[style] = text
        return out_dict

    def set_meta_tags(self, set_tags: dict[str, str]):
        """Set meta tags."""
        copied_tags = {**set_tags}
        meta_tags = self._parsed_xml.findall(".//metaTag")
        for tag in meta_tags:
            name = tag.attrib["name"]
            if name in copied_tags:
                tag.text = copied_tags.pop(name)

        # Print tags that were not found.
        for k, v in copied_tags.items():
            print(f"Could not set {k} to {v}")

    def write(self, out_path: Path | None = None):
        """Write to file.

        Args:
            out_path: File output path. If None, the read file will be replaced.
        """
        save_path = self._path if out_path is None else out_path

        _header = b'<?xml version="1.0" encoding="UTF-8"?>'

        # Create a new zip file
        temp_zip_path = save_path.parent / f"{save_path.stem}.temp"

        with zipfile.ZipFile(self._path, "r") as zip_in, zipfile.ZipFile(
            temp_zip_path, "w"
        ) as zip_out:
            # Iterate through all files in the original zip file
            for item in zip_in.infolist():
                if item.filename == self._packed_xml_name:
                    # Replace the specified file
                    modified_xml = ET.tostring(self._parsed_xml, encoding="utf-8")
                    modified_xml = _header + b"\n" + modified_xml
                    with zip_in.open(item.filename) as source_file:
                        zip_out.writestr(item, modified_xml)
                else:
                    # Copy other files unchanged
                    with zip_in.open(item.filename) as source_file:
                        zip_out.writestr(item, source_file.read())

        os.replace(temp_zip_path, save_path)
        return save_path


# Update meta tags in all files in a directory
if __name__ == "__main__":

    # Create the parser
    parser = argparse.ArgumentParser(description="Process a directory path.")
    parser.add_argument("process_dir", type=str, help="Path to the directory")
    args = parser.parse_args()
    score_dir = Path(args.process_dir)

    for ct, score_file in enumerate(score_dir.iterdir()):
        print(f"Processing file {ct}")
        if score_file.suffix != ".mscz":
            continue

        file_manager = MsczFileManager(score_file)
        file_manager.read_mscz()
        meta_tags = file_manager.get_meta_tags()
        set_tags = {"copyright": "Play-Along this score on YouTube on https://ytpa.ch"}

        # Extract title and composer from text boxes
        text_tags = file_manager.get_text()
        if "Title" in text_tags:
            set_tags["workTitle"] = text_tags["Title"]
        if "Composer" in text_tags:
            set_tags["composer"] = text_tags["Composer"]

        # Remove all other meta tags, except source
        for k, v in meta_tags.items():
            if k == "source":
                set_tags[k] = v
            elif k not in set_tags:
                set_tags[k] = None

        # Save with modified meta tags
        file_manager.set_meta_tags(set_tags)
        file_manager.write()
