"""Python package for reading and modifying MuseScore .mscz files."""

import xml.etree.ElementTree as ET
from pathlib import Path
import zipfile
import os


class MsczFileManager:
    _path: Path
    _packed_xml_name: str | None = None
    _parsed_xml: ET.Element | None = None

    def __init__(self, path: Path):
        self._path = path

    def read_mscz(self) -> ET.Element | None:
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
        if self._parsed_xml is None:
            return None
        meta_tags = self._parsed_xml.findall(".//metaTag")
        tag_dict: dict[str, str | None] = {}
        for tag in meta_tags:
            name = tag.attrib["name"]
            text = tag.text
            tag_dict[name] = text
        return tag_dict

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

    def write(self, out_path: Path | None):
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

    pass
