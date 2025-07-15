from contextlib import contextmanager
from pathlib import Path
import re
from tempfile import TemporaryDirectory


def safe_filename(name: str):
    """Replace any characters that are not safe for filenames."""
    return re.sub(r"[^\w.\- ]", "_", name.strip())


def get_input_list(in_path: Path, suffix: str):
    """Checks path for file(s) of specific type.

    If path is a directory, it is searched for such files.
    If path is a file, it is returned in a list if the extension is correct.

    Returns:
        List of .mscz files.
    """
    process_list = []
    if in_path.is_file():
        if in_path.suffix == suffix:
            process_list.append(in_path)
        else:
            print(f"Invalid file {in_path}")
    elif in_path.is_dir():
        for score_file in in_path.iterdir():
            if score_file.suffix == suffix:
                process_list.append(score_file)
        if len(process_list) == 0:
            print(f"No MuseScore files found in {in_path}")
    else:
        print(f"Invalid path {in_path}")
    return process_list


@contextmanager
def temporary_pathdir(*args, **kwargs):
    """Temporary directory context manager that returns a Path."""
    with TemporaryDirectory(*args, **kwargs) as tmpdir:
        yield Path(tmpdir)
