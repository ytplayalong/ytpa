"""Runs the lead sheet generator on audio files that have a hand made reference.

The reference scores are the ones listed in next/app/scores.json (MusicXML in
next/public/mxl). Audio files are found by the YouTube id in their name,
e.g. "Song [k6bHErrAel4].mp3".

Usage: python -m leadsheet.benchmark AUDIO_DIR [-o out_dir] [--only Name ...]
"""

import argparse
import json
from pathlib import Path

import numpy as np

from leadsheet.analysis import analyze
from leadsheet.evaluate import Score, bar_times_from_measure_map, compare
from leadsheet.notation import bar_times, count_bars, write_outputs

ROOT = Path(__file__).resolve().parent.parent


def find_audio(audio_dir: Path, video_id: str):
    for p in audio_dir.glob("*.mp3"):
        if f"[{video_id}]" in p.name:
            return p
    return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("audio_dir", type=Path)
    parser.add_argument("-o", "--out", type=Path, default=Path("leadsheet_out/benchmark"))
    parser.add_argument("--cache", type=Path, help="Cache dir, default: <out>/cache")
    parser.add_argument("--only", nargs="*", help="Only these fileNames from scores.json")
    parser.add_argument("--skip", nargs="*", default=["Me_Voy"])
    args = parser.parse_args()

    scores = json.loads((ROOT / "next/app/scores.json").read_text(encoding="utf-8"))
    cache = args.cache or args.out / "cache"
    rows = []
    for entry in scores:
        name = entry["fileName"]
        if name in args.skip or (args.only and name not in args.only):
            continue
        audio = find_audio(args.audio_dir, entry["videoId"])
        if audio is None:
            continue
        ref_path = ROOT / "next/public/mxl" / f"{name}.musicxml"
        print(f"== {name} ({audio.name})", flush=True)
        an = analyze(str(audio), cache_dir=cache)
        xml_path, _ = write_outputs(
            an, args.out, entry["name"], artist=entry["artist"], stem=name
        )

        gen, ref = Score(xml_path), Score(ref_path)
        n_gen = count_bars(an)
        gen_times = np.array(bar_times(an, n_gen + 1))
        gen_times[-1] = gen_times[-2] + (gen_times[-2] - gen_times[-3])
        ref_times = bar_times_from_measure_map(entry["measureMap"], len(ref.bar_quarters))
        res = compare(gen, gen_times, ref, ref_times)
        ref_meter = tuple(entry["times"][0])
        res["meter ok"] = float(tuple(an.meter) == ref_meter)
        res["key ok"] = float(an.fifths == entry["keys"][0])
        rows.append((name, an, ref_meter, entry["keys"][0], res))
        print(
            f"  meter {an.meter[0]}/{an.meter[1]} (ref {ref_meter[0]}/{ref_meter[1]}), "
            f"key {an.fifths:+d} (ref {entry['keys'][0]:+d}), tempo {an.tempo:.0f}\n  "
            + ", ".join(f"{k} {v:.2f}" for k, v in res.items() if k not in ("meter ok", "key ok"))
            + ("" if "chord" in res else ", (no reference chords)"),
            flush=True,
        )

    if rows:
        keys = [k for k in rows[0][4]]
        print("\nMean over", len(rows), "songs:")
        print(", ".join(f"{k} {np.mean([r[4][k] for r in rows]):.2f}" for k in keys))


if __name__ == "__main__":
    main()
