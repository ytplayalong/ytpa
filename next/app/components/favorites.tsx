"use client";

import { useEffect, useState } from "react";

import usePathTranslation from "@/i18n/hook";

import firebaseManager from "../firebase";
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

export const Favorites = () => {
  const { t } = usePathTranslation();

  return (
    <>
      <h4>{t("favorites")}</h4>
      <FavoritesNoTitle />
    </>
  );
};

const FavoritesNoTitle = () => {
  const loginRequired = useLoginRequired();
  const [favorites, setFavorites] = useState<FavoritesState>(initStatus);

  const loadFavs = async () => {
    const loadedFavorites = await firebaseManager.getFavorites();
    setFavorites({ loadingStatus: "succeeded", favorites: loadedFavorites });
    console.log("Loaded favorites");
  };

  useEffect(() => {
    if (loginRequired.user) {
      loadFavs();
    }
  }, [favorites.loadingStatus, loginRequired.user]);

  if (loginRequired.user === null) {
    console.log("Not logged-in");
    return loginRequired.component;
  }

  if (
    favorites.loadingStatus === "loading" ||
    loginRequired.user === undefined
  ) {
    return <Loading addComp={false} />;
  }

  if (favorites.favorites.length == 0) {
    return <p>No favorites added yet</p>;
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
  let favoriteScores = fullScoreInfo.filter((el) => favSets.has(el.videoId));
  favoriteScores = favoriteScores.reverse(); // Most recently added scores on top per default
  const { scores, sortInfo } = useProcessedScores(favoriteScores);

  const removeOptions = [
    { name: t("favoritesRemove"), onClick: removeFromFavorites },
  ];

  const favoriteScoreComp = (
    <ScoreTable scores={scores} sortInfo={sortInfo} options={removeOptions} />
  );

  return favoriteScoreComp;
};
