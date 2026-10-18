"""Automatic lead sheet draft generation from audio files.

Produces a MusicXML lead sheet (melody + chord symbols) and the sync info
(`measureMap`, as used in `next/app/scores.json`) from an audio file. The
result is a rough draft that is intended to be reviewed manually.

Usage: python -m leadsheet path/to/song.mp3 [-o out_dir]
"""
