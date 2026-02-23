"""Script for batch-exporting individual parts of a MuseScore file."""

import argparse
from pathlib import Path

from pypdf import PdfWriter
from tqdm import tqdm

from msczpy import MsczFileManager
from msczpy.fs import get_input_list, temporary_pathdir
from mxlpy import export_mscz_to_pdf


def get_parser():
    # Re-use module docstring as description:
    parser = argparse.ArgumentParser(description=__doc__)

    parser.add_argument("input_path", type=str, help="Input file or directory.")
    parser.add_argument("-o", "--output_dir", type=str, help="Output directory")
    parser.add_argument("-w", "--working_dir", type=str, help="Working directory")
    parser.add_argument(
        "-l2", "--second_level", action="store_true", help="Export folder structure"
    )
    parser.add_argument(
        "-hd", "--headless", action="store_true", help="Run in headless env."
    )
    return parser


def export_to_pdf(out_dir: Path, process_list: list[Path], 
                  intermediate_dir: Path | None = None, headless: bool = False):

    with temporary_pathdir() as temp_dir:
        if intermediate_dir is not None:
            temp_dir = intermediate_dir

        # For all files extract all parts into individual mscx files
        for mscz_file_path in tqdm(process_list, desc="Exporting individual parts."):
            file_manager = MsczFileManager(mscz_file_path)
            file_manager.read_mscz()
            file_manager.extract_parts(temp_dir)

        # Export all generated mscx files to PDF
        mscx_files = [
            file_p for file_p in temp_dir.iterdir() if file_p.suffix == ".mscx"
        ]
        out_pdf_files = []
        for mscx_file in tqdm(mscx_files, desc="Exporting PDF"):
            out_pdf = export_mscz_to_pdf(mscx_file, out_dir, headless)
            out_pdf_files.append(out_pdf)

        # Merge all PDFs
        merged_file_path = out_dir / "All_Parts_Merged.pdf"
        with PdfWriter() as pdf_writer:
            for pdf_file in out_pdf_files:
                pdf_writer.append(pdf_file)

            pdf_writer.write(merged_file_path)


def run_pdf_export():

    # Create the parser
    args = get_parser().parse_args()

    input_path = Path(args.input_path)

    if args.output_dir is None:
        out_dir = Path(__file__).parent / "out"
    else:
        out_dir = Path(args.output_dir)
    out_dir.mkdir(exist_ok=True)

    work_dir = None
    if args.working_dir is not None:
        work_dir = Path(args.working_dir)
        work_dir.mkdir(exist_ok=True)

    headless = True if args.headless else False

    if args.second_level:
        for sub_dir in input_path.iterdir():
            if not sub_dir.is_dir():
                continue

            process_list = get_input_list(sub_dir, ".mscz")
            if len(process_list) == 0:
                continue

            print(f"Processing {input_path.name}/{sub_dir.name}")

            sub_out_dir = out_dir / sub_dir.name
            sub_out_dir.mkdir(exist_ok=True)
            export_to_pdf(sub_out_dir, process_list, work_dir, headless)

    else:
        process_list = get_input_list(input_path, ".mscz")
        export_to_pdf(out_dir, process_list, work_dir, headless)


if __name__ == "__main__":
    run_pdf_export()
