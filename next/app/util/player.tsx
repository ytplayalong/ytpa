import React, { useCallback, useRef, useState } from "react";
import YouTube from "react-youtube";

import usePathTranslation from "@/i18n/hook";

import { useConsent } from "./consent";
import { buttonAttrs, containerInner } from "./styles";
import { Player, playerSizePx } from "./util";

/** YouTube player hook. */
export const useYoutubePlayer = (videoId: string) => {
  const playerRef = useRef<any>(null);

  // Is undefined as long as the video is not loaded (see YoutubePlayer)
  const getTime = useCallback(async () => {
    return await playerRef.current?.getInternalPlayer().getCurrentTime();
  }, [playerRef]);

  const comp = (
    <YoutubePlayer playerRef={playerRef} videoId={videoId}></YoutubePlayer>
  );

  return { comp, getTime } as Player;
};

/** Placeholder shown instead of the video until it is loaded from YouTube. */
const VideoPlaceholder = ({ onLoad }: { onLoad: VoidFunction }) => {
  const { t } = usePathTranslation();
  return (
    <div
      style={{
        height: playerSizePx.height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1em",
        padding: "1em",
        textAlign: "center",
        background: "var(--card)",
        border: "1px solid var(--line)",
      }}
    >
      <span>{t("videoPlaceholder")}</span>
      <button onClick={onLoad} {...buttonAttrs}>
        {t("loadVideo")}
      </button>
    </div>
  );
};

/** Youtube video player component.
 *
 * The video comes from the privacy-enhanced domain of YouTube. It is only
 * loaded if the visitor accepted cookies or clicks on "load video".
 */
const YoutubePlayer = ({
  videoId,
  playerRef,
}: {
  videoId: string;
  playerRef: any;
}) => {
  const consent = useConsent();
  const [loadedByClick, setLoadedByClick] = useState(false);

  const opts = {
    ...playerSizePx,
    host: "https://www.youtube-nocookie.com",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  // This is a hack for shutting up typescript compiler!
  const yt: React.ReactNode = React.createElement(YouTube as any, {
    videoId,
    opts,
    ref: playerRef,
    onReady: () => console.log(`I'm ready, loaded ${videoId}!`),
  });

  let content: React.ReactNode = null; // Nothing while the consent is not read
  if (consent === "accepted" || loadedByClick) {
    content = yt;
  } else if (consent !== "unknown") {
    content = <VideoPlaceholder onLoad={() => setLoadedByClick(true)} />;
  }
  return (
    <div style={{ ...playerSizePx, margin: "auto" }}>
      <div style={containerInner}>
        <div
          className="yt-embed"
          style={{
            borderRadius: "var(--radius)",
            overflow: "hidden",
            minHeight: consent === "unknown" ? playerSizePx.height : undefined,
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
};
