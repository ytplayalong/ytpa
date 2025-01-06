"""This python script generates the XML files.

It uses the MuseScore executable to export .mscz files to .musicxml
and then reduces the exported XML files by removing certain tags 
and attributes from the XML document.
"""

import argparse

from mxlpy import Paths, export_mscz
from mxlpy.clean_xml import reduce_file
from mxlpy.collect_info import extract_all_information


def export_yt(n_process: int | None):
    """Export scores corresponding to YouTube videos."""

    # Find all scores
    all_paths = list(Paths.find_all_scores(sort_by_modify_date=True))
    tot = len(all_paths)

    for ct, mscz_path in enumerate(all_paths):
        if n_process is not None and ct == n_process:
            print("Stopping")
            break

        out_path = Paths.XML_SCORES_PATH / f"{mscz_path.stem}.musicxml"

        # Export to musicxml
        export_mscz(mscz_path, out_path)

        # Reduce XML file
        reduce_file(out_path)

        # Print progress
        print(f"Processed [{ct + 1} / {tot}] {out_path.stem}")


def check_positive(value):
    ivalue = int(value)
    if ivalue < 0:
        raise argparse.ArgumentTypeError("%s is an invalid positive int value" % value)
    return ivalue


parser = argparse.ArgumentParser("Export script")
parser.add_argument(
    "-n", "--n-export", type=check_positive, default="0", required=False
)
parser.add_argument(
    "-m", "--no-mp3", action="store_true", default=False, required=False
)

if __name__ == "__main__":
    args = parser.parse_args()

    if args.n_export > 0:
        export_yt(args.n_export)

    # Extract info from musicXML directly
    extract_all_information()
