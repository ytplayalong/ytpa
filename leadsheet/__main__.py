"""Command line interface: python -m leadsheet song.mp3 [-o out_dir]."""

import argparse
import json
from pathlib import Path

from leadsheet.analysis import analyze
from leadsheet.filesjson import DEFAULT_PATH as DEFAULT_FILES_JSON
from leadsheet.filesjson import update_files_json, video_id_from_name
from leadsheet.notation import write_outputs


def main():
    parser = argparse.ArgumentParser(
        description="Create a lead sheet draft (MusicXML + sync info) from audio."
    )
    parser.add_argument("audio", type=Path, help="Audio file (mp3, wav, ...)")
    parser.add_argument("-o", "--out", type=Path, default=Path("leadsheet_out"))
    parser.add_argument(
        "--name", help="Title of the piece (may contain spaces), default: audio file name"
    )
    parser.add_argument("--artist", help="Artist, written as composer into the MusicXML")
    parser.add_argument(
        "--meter",
        default="auto",
        help="Time signature, e.g. 4/4, 3/4, 6/8 or auto (default).",
    )
    parser.add_argument(
        "--grid",
        type=int,
        choices=[1, 2],
        help="Rhythmic grid in 16ths: 1 = 16th notes, 2 = 8th notes. "
        "Default: 2.",
    )
    parser.add_argument(
        "--no-separation",
        action="store_true",
        help="Skip vocal separation (Demucs), much worse melody but no torch needed.",
    )
    parser.add_argument(
        "--track-beats",
        action="store_true",
        help="Follow tempo changes instead of fitting a constant tempo.",
    )
    parser.add_argument(
        "--downbeat-shift",
        type=int,
        default=0,
        help="Move the bar lines by this many beats if the downbeat guess is wrong.",
    )
    parser.add_argument(
        "--no-cleanup",
        action="store_true",
        help="Do not merge tied notes / add beams (see leadsheet.cleanup).",
    )
    parser.add_argument(
        "--cache",
        type=Path,
        help="Directory for caching the slow steps (stems, pitch), for experiments.",
    )
    parser.add_argument(
        "--video-id",
        help="YouTube id for files.json, default: taken from the audio file name "
        "('Song [id].mp3')",
    )
    parser.add_argument("--language", help="Language of the lyrics for files.json")
    parser.add_argument(
        "--files-json",
        type=Path,
        default=DEFAULT_FILES_JSON,
        help="files.json to add / update the entry in (default: the one of this repo)",
    )
    parser.add_argument(
        "--no-files-json", action="store_true", help="Do not touch files.json."
    )
    args = parser.parse_args()

    title = args.name or args.audio.stem
    print(f"Analyzing {args.audio} ...")
    an = analyze(
        str(args.audio),
        meter=args.meter,
        separate=not args.no_separation,
        constant_tempo=not args.track_beats,
        downbeat_shift=args.downbeat_shift,
        cache_dir=args.cache,
    )
    print(
        f"Meter {an.meter[0]}/{an.meter[1]}, tempo {an.tempo:.1f} bpm, key signature {an.fifths:+d} fifths, "
        f"{len(an.notes)} melody notes detected"
    )
    xml_path, json_path = write_outputs(
        an,
        args.out,
        title,
        args.grid,
        cleanup=not args.no_cleanup,
        artist=args.artist,
    )
    print(f"Wrote {xml_path}\nWrote {json_path}")
    if not args.no_files_json:
        info = json.loads(json_path.read_text(encoding="utf-8"))
        print(
            update_files_json(
                xml_path.stem,
                info["measureMap"],
                title,
                args.artist,
                args.video_id or video_id_from_name(args.audio),
                args.language,
                args.files_json,
            )
        )
    print("This is a draft, please review it manually.")


if __name__ == "__main__":
    main()
