"""Musicxml python package."""

import subprocess
from pathlib import Path
import time

from mxlpy.clean_xml import reduce_file
from mxlpy.util import Paths


def export_mscz(mscz_src: Path, out_path: Path, headless: bool = False):
    """Export MuseScore file."""
    ms_exe = Paths.find_musescore_binary()
    args = [str(ms_exe), "-o", str(out_path), str(mscz_src)]
    if headless:
        args = ["xvfb-run", *args]
    subprocess.run(args,
        stderr=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL)
    
    ct = 0
    while not out_path.exists() and ct < 200:
        time.sleep(0.1)
        ct += 1
    assert out_path.exists(), f"Export failed {mscz_src}"
    return out_path


def export_mscz_to_pdf(mscz_src: Path, out_path: Path, headless: bool = False):
    """Export mscz file as PDF."""
    if out_path.is_dir():
        assert out_path.exists()
        out_path = out_path / f"{mscz_src.stem}.pdf"

    return export_mscz(mscz_src, out_path, headless)


__all__ = ["Paths", "export_mscz", "reduce_file"]
