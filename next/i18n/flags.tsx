import Image from "next/image";

import De from "./flags/de.svg";
import Fr from "./flags/fr.svg";
import En from "./flags/en.svg";
import Es from "./flags/es.svg";

const flagDict: { [key: string]: any } = {
  en: En,
  de: De,
  es: Es,
  fr: Fr,
};

export const getFlag = (code: string) => {
  const src = flagDict[code];
  if (!src) {
    throw new Error("No flag for " + code);
  }
  const imgStyle = { margin: "auto" };
  return (
    <Image src={src} alt={`Flag for ${code}`} width={35} style={imgStyle} />
  );
};
