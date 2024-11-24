"use client";

import { useEffect, useState } from "react";
import { containerInner } from "../util/styles";
import firebaseManager from "../firebase";
import { fullScoreInfo } from "../util/util";
import { ScoreTable } from "./scoreTable";
import usePathTranslation from "@/i18n/hook";
import { useLoginRequired } from "./loginRequired";

type FavoritesState = {
  loadingStatus: "loading" | "succeeded" | "failed";
  favorites: string[];
};

const initStatus: FavoritesState = {
  loadingStatus: "loading",
  favorites: [],
};

export const Favorites = () => {
  const { t } = usePathTranslation();

  const loginRequired = useLoginRequired();
  const [favorites, setFavorites] = useState<FavoritesState>(initStatus);

  const loadFavs = async () => {
    const loadedFavorites = await firebaseManager.getFavorites();
    setFavorites({ loadingStatus: "succeeded", favorites: loadedFavorites });
    console.log("Loaded favorites");
  };
  const wrap = (el: any) => {
    return (
      <>
        <div className="container">
          <div style={containerInner}>
            <h4>{t("favorites")}</h4>
            {el}
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (loginRequired.isLoggedIn) {
      loadFavs();
    }
  }, [favorites.loadingStatus]);

  if (!loginRequired.isLoggedIn) {
    console.log("Loading favorites");
    return wrap(loginRequired.component);
  }

  if (favorites.loadingStatus == "loading") {
    return wrap("Loading");
  }

  if (favorites.favorites.length == 0) {
    return wrap("No favorites added yet");
  }

  const favSets = new Set<string>(favorites.favorites);
  let scores = fullScoreInfo.filter((el) => favSets.has(el.videoId));
  scores = scores.reverse(); // Most recently added scores on top

  const removeFromFavorites = async (scoreId: string) => {
    await firebaseManager.removeFromFavorites(scoreId);
    const newFav = favorites.favorites.filter((el) => el != scoreId);
    setFavorites({ favorites: newFav, loadingStatus: "succeeded" });
  };
  const removeOptions = [
    { name: "Remove from favorites", onClick: removeFromFavorites },
  ];
  const favoriteScores = <ScoreTable scores={scores} options={removeOptions} />;

  return wrap(favoriteScores);
};
