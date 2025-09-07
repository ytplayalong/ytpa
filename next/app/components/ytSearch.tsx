"use client";

import { MdArrowBack } from "react-icons/md";
import React, { useState } from "react";
import { buttonAttrs, inputStyle } from "../util/styles";
import {
  BasicTable,
  leftTdStyle,
  tableRowHeight,
  tdStyle,
  thStyle,
} from "../util/tables";
import usePathTranslation from "@/i18n/hook";

export interface YtSearchResult {
  id: {
    kind: "youtube#video";
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string; width?: number; height?: number };
      medium?: { url: string; width?: number; height?: number };
      high?: { url: string; width?: number; height?: number };
    };
  };
}

const API_KEY = "AIzaSyDg5-5jYRHEkl63llX8WBIGWYjiKISpPKs";

export function useYtVideoSelector(
  onVideoSet: (v: YtSearchResult) => void,
  setError: (s: string) => void
) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YtSearchResult[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YtSearchResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { t } = usePathTranslation();

  const searchVideos = async () => {
    setError(""); // Clear error
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=6&q=${encodeURIComponent(
          query
        )}&key=${API_KEY}`
      );
      const data = await res.json();
      setResults(data.items || []);
    } catch (err) {
      setError(`YouTube search error: ${err}`);
    }
    setLoading(false);
  };

  const selectVideo = (video: YtSearchResult) => {
    setSelectedVideo(video);
    setResults([]);
    onVideoSet(video);
  };

  // Define result table
  const header = (
    <>
      <th style={{ width: "10%", ...thStyle }}></th>
      <th style={{ width: "50%", ...thStyle }}>{t("title")}</th>
      <th style={{ width: "40%", ...thStyle }}>{t("channel")}</th>
    </>
  );
  const body = (
    <>
      {results.map((video) => {
        return (
          <tr
            key={video.id.videoId}
            style={{ cursor: "pointer", height: tableRowHeight }}
            className="hoverlink"
            onClick={() => selectVideo(video)}
          >
            <td style={{ ...leftTdStyle, height: tableRowHeight }}>
              <div style={{ height: tableRowHeight, alignContent: "center" }}>
                <img
                  height={tableRowHeight}
                  src={video.snippet.thumbnails.default.url}
                  alt={video.snippet.title}
                />
              </div>
            </td>
            <td style={tdStyle}>{video.snippet.title}</td>
            <td style={tdStyle}>{video.snippet.channelTitle}</td>
          </tr>
        );
      })}
    </>
  );
  const table =
    results.length > 0 ? <BasicTable header={header} body={body} /> : null;

  // The selector component
  const onInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setResults([]);
    setQuery(e.target.value);
  };

  const videoId = selectedVideo?.id?.videoId || null;
  const channelTitle = selectedVideo?.snippet.channelTitle;
  const title = selectedVideo?.snippet.title;

  // Do not show search if video is selected
  const selector =
    videoId !== null ? null : (
      <>
        <input
          type="text"
          value={query}
          onChange={onInput}
          onKeyDown={(e) => e.key === "Enter" && searchVideos()}
          placeholder={t("searchYouTube")}
          style={{ ...inputStyle, marginBottom: "0.5em" }}
        />
        <button onClick={searchVideos} disabled={loading} {...buttonAttrs}>
          {loading ? "..." : t("runSearch")}
        </button>
        {table}
      </>
    );
  const resetVideo = () => {
    setSelectedVideo(null);
  };

  const videoInfo =
    videoId == null
      ? null
      : {
          videoId,
          title,
          channelTitle,
        };
  const ytSearchComp = (
    <>
      {selector}
      {videoId && (
        <>
          <button onClick={resetVideo} disabled={loading} {...buttonAttrs}>
            <MdArrowBack size={18} style={{ marginRight: "4px", padding: 0 }} />
            {t("backToSearch")}
          </button>
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            allowFullScreen
            style={{ border: 0, marginTop: "0.5em", marginBottom: "0.5em" }}
          ></iframe>
        </>
      )}
    </>
  );

  return { ytSearchComp, videoInfo, resetVideo };
}
