import { TestComp } from "@/app/components/test";
import { containerInner } from "@/app/util/styles";
import { getStaticLocaleParams } from "@/i18n";

export default function Spotify() {
  return (
    <div className="container">
      <TestComp />
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

export const generateStaticParams = getStaticLocaleParams;
