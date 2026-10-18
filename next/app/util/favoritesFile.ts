import { fullScoreInfo } from "./util";

const FILE_TYPE = "ytpa-favorites";

const knownIds = new Set(fullScoreInfo.map((sc) => sc.videoId));

/** Creates the content of the favorites file (JSON).
 *
 * Name and artist are only there to make the file readable.
 */
export const createFavoritesFile = (favoriteIds: string[]) => {
  const byId = new Map(fullScoreInfo.map((sc) => [sc.videoId, sc]));
  const favorites = favoriteIds.map((videoId) => ({
    videoId,
    name: byId.get(videoId)?.name,
    artist: byId.get(videoId)?.artist,
  }));
  return JSON.stringify({ type: FILE_TYPE, version: 1, favorites }, null, 2);
};

/** Reads the video ids from the content of a favorites file.
 *
 * Accepts the exported format and also a plain list of ids. Throws if the file
 * can not be read. Ids of pieces that do not exist (anymore) are counted in
 * `unknown`.
 */
export const parseFavoritesFile = (text: string) => {
  const data = JSON.parse(text);
  const list: unknown = Array.isArray(data) ? data : data?.favorites;
  if (!Array.isArray(list)) {
    throw new Error("No list of favorites found.");
  }

  const ids: string[] = [];
  for (const el of list) {
    const id = typeof el === "string" ? el : el?.videoId;
    if (typeof id !== "string") {
      throw new Error("Invalid entry in the list of favorites.");
    }
    ids.push(id);
  }

  const unique = Array.from(new Set(ids));
  return {
    ids: unique.filter((id) => knownIds.has(id)),
    unknown: unique.filter((id) => !knownIds.has(id)).length,
  };
};
