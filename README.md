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

## Styling

No UI framework, only plain CSS in `next/app/globals.css`: design tokens (CSS
variables) for the light and dark theme (follows the system setting) and the
styles of buttons, selects, inputs, dialogs and tables. Inline styles in the
components use these variables (e.g. `var(--card)`), see `next/app/util/styles.ts`.
Choices are native `<select>`s, dialogs are native `<dialog>`s (`Dialog` component).
The sheet music stays on white paper in the dark theme.

## Checks

GitHub Actions (`.github/workflows/ci.yml`) runs on every push to `main` and on
pull requests: ESLint, the type-check and the build of the web app, and a
syntax check of the Python tools. To run the same checks locally:

```bash
cd next
npm run check    # lint, typecheck and build, or one of them separately
```

TypeScript is installed twice on purpose (see `next/package.json`): `typescript`
is the 6.0 package (`@typescript/typescript6`) that ESLint and Next.js need,
`@typescript/native` is TypeScript 7 which provides the `tsc` command.

## Cookies and third parties

The banner at the bottom (`Cookie settings` in the footer opens it again) stores
the decision in the cookie `cookieConsent` (`accepted` / `declined`, 1 year).
The site can be used without deciding.

| | accepted | declined / not decided |
|---|---|---|
| Google Analytics (home page views) | loaded | not loaded, `_ga` cookies removed |
| YouTube video on the piece page | loaded directly | placeholder, loaded on click ("Load video") |

The video is always embedded from the privacy-enhanced domain
(`youtube-nocookie.com`). Not covered by the decision: settings in the
local storage (needed for the function), the thumbnails from `img.youtube.com`
in the lists, Firebase (login, favorites, suggestions) and Formspree (contact
form) which are only used on request of the visitor.

## Installable web app / offline

`next/public/sw.js` (registered in the built site only) and
`next/public/site.webmanifest` make the site installable ("Install app" in the
settings, or the install option of the browser). Pages, scores and images of the
own site that were opened once are kept in a cache (network first, so a
new version is always used when online) and work offline. YouTube and Firebase
are not touched, so the video and login need a connection. To invalidate all
caches, change `VERSION` in `sw.js`.
