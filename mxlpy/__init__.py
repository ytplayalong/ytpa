"""Musicxml python package."""

import subprocess
from pathlib import Path

from mxlpy.clean_xml import reduce_file
from mxlpy.util import Paths


def export_mscz(mscz_src: Path, out_path: Path) -> None:
    subprocess.run([str(Paths.MUSESCORE_EXE_PATH), "-o", str(out_path), str(mscz_src)])
    assert out_path.exists(), f"Export failed {mscz_src}"


__all__ = ["Paths", "export_mscz", "reduce_file"]
