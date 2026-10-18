import { Suggestion, SuggestionStatus } from "../firebase";
import { getScoreInfo, ScoreInfo } from "./util";

/** Priorities admins can assign, 3 is the highest. */
export const priorities = [1, 2, 3] as const;

export type StatusGroup = "new" | "prioritized" | "discarded";

export const statusGroup = (s: Suggestion): StatusGroup => {
  if (s.status === undefined) {
    return "new";
  }
  return s.status === "discarded" ? "discarded" : "prioritized";
};

const created = (s: Suggestion) => s.createdAt?.toMillis() ?? 0;

/** Rank of the status, higher is more important. */
const rank = (s: Suggestion) => {
  if (s.status === undefined) {
    return 0;
  }
  return s.status === "discarded" ? -1 : s.status;
};

const groupOrder: StatusGroup[] = ["new", "prioritized", "discarded"];

/** New suggestions first (newest on top), then the prioritized ones (highest
 * priority first) and the discarded ones at the end.
 */
export const sortSuggestions = (all: Suggestion[]) => {
  return [...all].sort((a, b) => {
    const groupDiff =
      groupOrder.indexOf(statusGroup(a)) - groupOrder.indexOf(statusGroup(b));
    if (groupDiff !== 0) {
      return groupDiff;
    }
    return rank(b) - rank(a) || created(b) - created(a);
  });
};

type Translate = (key: string, options?: Record<string, unknown>) => string;

/** Text for the status of a suggestion. */
export const statusLabel = (t: Translate, status?: SuggestionStatus) => {
  if (status === undefined) {
    return t("newSuggestion");
  }
  return status === "discarded"
    ? t("statusDiscarded")
    : t("statusPriority", { num: status });
};

const normalize = (text: string) =>
  text.toLowerCase().replaceAll(/[^\p{L}\p{N}]+/gu, "");

/** Keys identifying the same song: the video or the name and artist. */
const duplicateKeys = (s: Suggestion) => [
  `video:${s.videoUrl}`,
  `song:${normalize(s.name)}|${normalize(s.artist)}`,
];

/** Groups of duplicate suggestions (same video or same name and artist).
 *
 * Each group has the suggestion to keep first (best status, then the
 * oldest), followed by the duplicates that can be removed.
 */
export const findDuplicateGroups = (all: Suggestion[]) => {
  // Union-find over suggestions that share a key
  const parent = new Map<string, string>(all.map((s) => [s.id, s.id]));
  const find = (id: string): string => {
    while (parent.get(id) !== id) {
      parent.set(id, parent.get(parent.get(id)!)!);
      id = parent.get(id)!;
    }
    return id;
  };
  const byKey = new Map<string, string>();
  for (const s of all) {
    for (const key of duplicateKeys(s)) {
      const other = byKey.get(key);
      if (other === undefined) {
        byKey.set(key, s.id);
      } else {
        parent.set(find(s.id), find(other));
      }
    }
  }

  const groups = new Map<string, Suggestion[]>();
  for (const s of all) {
    const root = find(s.id);
    groups.set(root, [...(groups.get(root) ?? []), s]);
  }
  return [...groups.values()]
    .filter((g) => g.length > 1)
    .map((g) =>
      [...g].sort(
        (a, b) =>
          rank(b) - rank(a) || created(a) - created(b),
      ),
    );
};

let scoreByVideo: Map<string, ScoreInfo> | null = null;

/** Returns a function that gives the score of a suggested video if it is
 * already available.
 */
export const useAvailableScores = () => {
  scoreByVideo ??= new Map(getScoreInfo().map((sc) => [sc.videoId, sc]));
  const lookup = scoreByVideo;
  return (s: Suggestion) => lookup.get(s.videoUrl);
};

/** Extracts the video id from a YouTube link or a plain id, null if invalid. */
export const parseVideoId = (input: string) => {
  const text = input.trim();
  if (/^[\w-]{11}$/.test(text)) {
    return text;
  }
  try {
    const url = new URL(text.includes("://") ? text : `https://${text}`);
    const host = url.hostname.replace(/^(www|m|music)\./, "");
    let id: string | null = null;
    if (host === "youtu.be") {
      id = url.pathname.slice(1).split("/")[0];
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id =
        url.searchParams.get("v") ??
        url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]+)/)?.[1] ??
        null;
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
};

// Words in brackets that are no part of the title, e.g. "(Official Video)"
const NOISE =
  /official|video|lyric|audio|clip|musikvideo|offiziell|remaster|\bhd\b|\bhq\b|\b4k\b|visuali[sz]er|live|karaoke/i;

/** Cleans up a title and artist copied from YouTube.
 *
 * Removes noise like "(Official Video)" and "VEVO" and splits
 * "Artist - Title" into artist and title.
 */
export const cleanUpTitleArtist = (name: string, artist: string) => {
  const collapse = (text: string) => text.replaceAll(/\s+/g, " ").trim();
  let title = name.replaceAll(/[([{]([^)\]}]*)[)\]}]/g, (m, inner) =>
    NOISE.test(inner) ? " " : m,
  );
  title = collapse(title.replace(/[\s|\-–—:]+$/, ""));

  let cleanArtist = collapse(
    artist
      .replace(/\s*-\s*topic$/i, "")
      .replace(/vevo$/i, "")
      .replace(/\s*(official( channel| music)?)$/i, ""),
  );

  const split = title.match(/^(.+?)\s+[-–—]\s+(.+)$/);
  if (split) {
    const [first, second] = [collapse(split[1]), collapse(split[2])];
    if (cleanArtist && normalize(second) === normalize(cleanArtist)) {
      title = first; // "Title - Artist", the channel is the second part
    } else {
      cleanArtist = first;
      title = second;
    }
  }
  return { name: title, artist: cleanArtist };
};
