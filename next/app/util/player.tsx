import YouTube from "react-youtube";
import React, { useCallback, useRef } from "react";
import { Player, playerSizePx } from "./util";
import { containerInner } from "./styles";

/** YouTube player hook. */
export const useYoutubePlayer = (videoId: string) => {
  const playerRef = useRef<any>();

  const getTime = useCallback(async () => {
    return await playerRef.current.getInternalPlayer().getCurrentTime();
  }, [playerRef]);

  const comp = (
    <YoutubePlayer playerRef={playerRef} videoId={videoId}></YoutubePlayer>
  );

  return { comp, getTime } as Player;
};

/** Youtube video player component. */
const YoutubePlayer = ({
  videoId,
  playerRef,
}: {
  videoId: string;
  playerRef: any;
}) => {
  const opts = {
    ...playerSizePx,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  // This is a hack for shutting up typescript compiler!
  const yt: any = React.createElement(YouTube as any, {
    videoId,
    opts,
    ref: playerRef,
    onReady: () => console.log(`I'm ready, loaded ${videoId}!`),
  });
  return (
    <div style={{ ...playerSizePx, margin: "auto" }}>
      <div style={containerInner}>{yt}</div>
    </div>
  );
};
