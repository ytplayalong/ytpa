import { containerInner } from "@/app/util/styles";

export default function Spotify() {
  return (
    <div className="container">
      <div style={containerInner}>
        <h2>Spotify test</h2>
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/track/7lEptt4wbM0yJTvSG5EBof?utm_source=generator"
          width="300"
          height="380"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        ></iframe>
      </div>
    </div>
  );
}

export { getStaticLocaleParams as generateStaticParams } from "@/i18n";
