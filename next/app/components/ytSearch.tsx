"use client";
import React, { useState } from "react";

const API_KEY = "AIzaSyDg5-5jYRHEkl63llX8WBIGWYjiKISpPKs"; // 🔑 Replace with your key

export default function YouTubeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(
          query
        )}&key=${API_KEY}`
      );
      const data = await res.json();
      setResults(data.items || []);
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search YouTube videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((video) => (
          <div key={video.id.videoId} className="rounded-2xl shadow p-2">
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              title={video.snippet.title}
              allowFullScreen
              className="rounded-xl"
            ></iframe>
            <p className="mt-2 text-sm font-medium">{video.snippet.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
