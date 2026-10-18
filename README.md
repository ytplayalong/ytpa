# YouTube Play-Along Webapp (YTPA)

Deployed on https://ytpa.ch.

The website features interactive sheet music that is synced with corresponding YouTube music videos, 
allowing you to play along with the video as you practice.

## Lead sheet draft generator

`leadsheet/` creates a draft lead sheet (melody + chord symbols, MusicXML) and
the sync info (`measureMap`, `keys`, `times` as in `next/app/scores.json`) from
an audio file. It estimates tempo, meter (4/4 or compound 6/8), beats, bars, key, chords
(template matching + Viterbi) and the melody (vocals isolated with Demucs, then CREPE pitch tracking). The output is meant to be
reviewed and corrected manually.

```bash
pip install -r leadsheet/requirements.txt
python -m leadsheet "song.mp3" -o leadsheet_out --name "My Song" --artist "Some Artist"
```

`--name` is the title, the files are named after it (spaces replaced by
underscores, the artist is appended if that file already exists). The artist is
written as composer into the MusicXML.

The entry of the score in `files.json` (YouTube id, sync info, title, artist,
language) is added or updated, which is what `export.py` uses after the manual
review. The YouTube id is taken from an audio file name like `Song [id].mp3`, or
set it with `--video-id` (and `--language`); `--no-files-json` skips this.

Options: `--meter` (`auto`, `4/4`, `3/4`, `6/8`, ...), `--grid` (1 = 16th, 2 = 8th note quantization),
`--downbeat-shift` (move bar lines by beats), `--track-beats` (follow tempo
changes instead of a constant tempo), `--no-separation`, `--no-cleanup`.

Tied notes are merged, beams added and empty bars replaced by whole measure rests by `leadsheet/cleanup.py`, which can also
be run on any MusicXML file: `python -m leadsheet.cleanup in.musicxml -o out.musicxml`.
Measure times in the `measureMap` are only anchors every 4 bars, so tempo
drift should be checked against the video.

To measure the quality against the hand made scores in `scores.json` (needs the
audio files, found by the YouTube id in their name, e.g. `Song [k6bHErrAel4].mp3`):
`python -m leadsheet.benchmark AUDIO_DIR`. It reports meter, key, chord and note
accuracy per song (slow steps are cached, see `--cache`). The chord model
parameters are in `leadsheet.analysis.TUNING`.

## Suggestion editing (admins)

Admins can set a status (new, priority 1-3 with 3 the highest, or discarded) and remove duplicate song suggestions on
`/suggestions/edit` (linked from the suggestions page, only visible to admins).
The suggestions page lists new ones first, then the prioritized and the discarded ones.

A user is an admin if there is a document with their uid as id in the Firestore
collection `admins` (create it by hand in the Firebase console). The security
rules in `firestore.rules` make sure that only admins can change or delete
suggestions, they have to be deployed (copied to the Firebase console) by hand.

## Login with a Google account

The login and register pages have a "Continue with Google" button (Firebase
Authentication with `signInWithPopup`). A new user is created automatically at
the first login, Google accounts count as verified.

Setup in the Firebase console (Authentication):
- Sign-in method: enable the **Google** provider.
- Settings -> Authorized domains: `ytpa.ch` (and `localhost` for development).
