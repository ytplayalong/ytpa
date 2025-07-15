import argparse
from pathlib import Path

from tqdm import tqdm

from msczpy import MsczFileManager
from msczpy.fs import get_input_list, temporary_pathdir
from mxlpy import export_mscz_to_pdf


def get_parser():
    parser = argparse.ArgumentParser(description="Process a directory path.")
    parser.add_argument("input_path", type=str, help="Input file or directory.")
    parser.add_argument("-o", "--output_dir", type=str, help="Output directory")
    parser.add_argument(
        "-m3", "--musescore_v3", action="store_true", help="Use MuseScore version 3"
    )
    return parser


def run_pdf_export():

    # Create the parser
    args = get_parser().parse_args()

    input_path = Path(args.input_path)
    process_list = get_input_list(input_path, ".mscz")

    if args.output_dir is None:
        out_dir = Path(__file__).parent / "out"
    else:
        out_dir = Path(args.output_dir)
    out_dir.mkdir(exist_ok=True)

    with temporary_pathdir() as temp_dir:

        # For all files extract all parts into individual mscx files
        for mscz_file_path in tqdm(process_list, desc="Exporting individual parts."):
            file_manager = MsczFileManager(mscz_file_path)
            file_manager.read_mscz()
            file_manager.extract_parts(temp_dir)

        # Export all generated mscx files to PDF
        mscx_files = [
            file_p for file_p in temp_dir.iterdir() if file_p.suffix == ".mscx"
        ]
        for mscx_file in tqdm(mscx_files, desc="Exporting PDF"):
            export_mscz_to_pdf(mscx_file, out_dir, args.musescore_v3)


if __name__ == "__main__":
    run_pdf_export()
