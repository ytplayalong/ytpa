"use client";

import { useEffect, useState } from "react";

import usePathTranslation from "@/i18n/hook";

import firebaseManager from "../firebase";
import { containerInner } from "../util/styles";
import { fullScoreInfo } from "../util/util";
import { Loading } from "./loading";
import { useLoginRequired } from "./loginRequired";
import { useProcessedScores } from "./listAll";
import { ScoreTable } from "./scoreTable";

type FavoritesState = {
  loadingStatus: "loading" | "succeeded" | "failed";
  favorites: string[];
};

const initStatus: FavoritesState = {
  loadingStatus: "loading",
  favorites: [],
};

const wrap = (el: React.ReactNode, t: any) => {
  return (
    <div className="container">
      <div style={containerInner}>
        <h4>{t("favorites")}</h4>
        {el}
      </div>
    </div>
  );
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
  const title = t("favorites");

  useEffect(() => {
    if (loginRequired.user) {
      loadFavs();
    }
  }, [favorites.loadingStatus, loginRequired.user]);

  if (loginRequired.user === null) {
    console.log("Not logged-in");
    return wrap(loginRequired.component, t);
  }

  if (
    favorites.loadingStatus === "loading" ||
    loginRequired.user === undefined
  ) {
    return <Loading title={title} addComp={true} />;
  }

  if (favorites.favorites.length == 0) {
    return wrap("No favorites added yet", t);
  }

  const removeFromFavorites = async (scoreId: string) => {
    await firebaseManager.removeFromFavorites(scoreId);
    const newFav = favorites.favorites.filter((el) => el != scoreId);
    setFavorites({ favorites: newFav, loadingStatus: "succeeded" });
  };
  return (
    <FavoritesNotNull
      favorites={favorites}
      removeFromFavorites={removeFromFavorites}
    />
  );
};

const FavoritesNotNull = ({
  favorites,
  removeFromFavorites,
}: {
  favorites: FavoritesState;
  removeFromFavorites: (scoreId: string) => Promise<void>;
}) => {
  const { t } = usePathTranslation();

  const favSets = new Set<string>(favorites.favorites);
  let allScores = fullScoreInfo.filter((el) => favSets.has(el.videoId));
  allScores = allScores.reverse(); // Most recently added scores on top per default
  const { scores, sortInfo } = useProcessedScores(allScores);

  const removeOptions = [
    { name: t("favoritesRemove"), onClick: removeFromFavorites },
  ];

  const favoriteScores = (
    <ScoreTable scores={scores} sortInfo={sortInfo} options={removeOptions} />
  );

  return wrap(favoriteScores, t);
};
