"""Python package for reading and modifying MuseScore .mscz files."""

import copy
import xml.etree.ElementTree as ET
from pathlib import Path
import zipfile
import os
import argparse

from msczpy.fs import get_input_list, safe_filename

TEST_SCORE_PATH = Path(__file__).parent / "test.mscz"


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

    def extract_parts(self, out_dir: Path):
        """Create individual mscx files, one for each part."""

        assert self._parsed_xml is not None, "File not read yet!"

        # Navigate to the outer <Score> element
        outer_score = self._parsed_xml.find("Score")

        # Iterate over all nested <Score> elements
        inner_scores = [child for child in outer_score if child.tag == "Score"]
        for i, inner_score in enumerate(inner_scores, 1):

            new_root = copy.deepcopy(self._parsed_xml)

            # Replace <Score> element with inner one
            old_score = new_root.find("Score")
            new_root.remove(old_score)
            new_root.append(inner_score)

            # Use the part name to define the filename
            name_elem = inner_score.find("name")
            score_name = name_elem.text if name_elem is not None else f"part_{i}"
            filename = safe_filename(score_name)
            out_path = out_dir / f"{safe_filename(self._path.stem)}_{filename}.mscx"

            # Write to file
            with open(out_path, "wb") as f:
                f.write(self.get_write_xml(new_root))

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

    @staticmethod
    def get_write_xml(xml: ET.Element):
        _header = b'<?xml version="1.0" encoding="UTF-8"?>'
        modified_xml = ET.tostring(xml, encoding="utf-8")
        modified_xml = _header + b"\n" + modified_xml
        return modified_xml

    def write(self, out_path: Path | None = None):
        """Write to file.

        Args:
            out_path: File output path. If None, the read file will be replaced.
        """
        save_path = self._path if out_path is None else out_path

        # Create a new zip file
        temp_zip_path = save_path.parent / f"{save_path.stem}.temp"

        with zipfile.ZipFile(self._path, "r") as zip_in, zipfile.ZipFile(
            temp_zip_path, "w"
        ) as zip_out:
            # Iterate through all files in the original zip file
            for item in zip_in.infolist():
                if item.filename == self._packed_xml_name:
                    # Replace the specified file
                    modified_xml = self.get_write_xml(self._parsed_xml)
                    with zip_in.open(item.filename) as source_file:
                        zip_out.writestr(item, modified_xml)
                else:
                    # Copy other files unchanged
                    with zip_in.open(item.filename) as source_file:
                        zip_out.writestr(item, source_file.read())

        os.replace(temp_zip_path, save_path)
        return save_path

    def set_copyright(self, source: str | None = None):
        meta_tags = self.get_meta_tags()
        set_tags = {"copyright": "Play-Along this score on YouTube on https://ytpa.ch"}

        # Extract title and composer from text boxes
        text_tags = self.get_text()
        if "Title" in text_tags:
            set_tags["workTitle"] = text_tags["Title"]
        if "Composer" in text_tags:
            set_tags["composer"] = text_tags["Composer"]

        # Remove all other meta tags, except source
        for k, v in meta_tags.items():
            if k == "source":
                set_tags[k] = v if source is None else source
            elif k not in set_tags:
                set_tags[k] = None

        # Save with modified meta tags
        self.set_meta_tags(set_tags)


# Update meta tags in all files in a directory
if __name__ == "__main__":
    # Create the parser
    parser = argparse.ArgumentParser(description="Process a directory path.")
    parser.add_argument("input_path", type=str, help="Input file or directory.")
    parser.add_argument("--output_dir", type=str, help="Output directory")
    args = parser.parse_args()

    input_path = Path(args.input_path)
    process_list = get_input_list(input_path, ".mscz")

    for ct, score_file in enumerate(process_list):
        print(f"Processing file {ct}")

        file_manager = MsczFileManager(score_file)
        file_manager.read_mscz()
        file_manager.set_copyright()
        file_manager.write()
