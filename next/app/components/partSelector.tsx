import { useEffect, useState } from "react";

import usePathTranslation from "@/i18n/hook";

import {
  buttonAttrs,
  containerInner,
  distributedStyle,
  flexCentered,
  getButtonAttrs,
} from "../util/styles";
import {
  getSingleXml,
  parseXml,
  Player,
  playerSizePx,
  ScoreInfo,
  transpose,
  transposeKeys,
} from "../util/util";
import { Loading } from "./loading";
import { MovingSheet } from "./movingSheet";
import { resolveOption, useFavoriteOption } from "./scoreTable";
import { settingsManager } from "./settings";

type PartSelectorState = {
  xml: Document;
  origXml: Document;
  parts: { id: string; name: string }[];
  currPartIdx: number;
  pitch: string;
  octave: number;
};

const allOctaves = [1, 0, -1];

/** Loads a local xml file. */
const loadXmlFile = async (fileName: string) => {
  const res = await fetch(fileName);
  return res.text();
};

const removeUnused = (
  baseEl: Document,
  parName: string,
  childName: string,
  partId: string,
) => {
  const parEl = getSingleXml(baseEl, parName);
  for (const el of parEl.childNodes) {
    if (el.nodeName === childName && (el as any).id !== partId) {
      el.remove();
    }
  }
};

/** Copy XML object. */
const cloneDoc = (doc: Document) => {
  const newDoc: any = doc.cloneNode(true);
  newDoc.xmlStandalone = (doc as any).xmlStandalone;
  return newDoc as Document;
};

const extractPartXml = (state: PartSelectorState) => {
  const partId = state.parts[state.currPartIdx].id;

  const parsedXML = cloneDoc(state.origXml);

  // Remove all but current part from part-list
  removeUnused(parsedXML, "part-list", "score-part", partId);

  // Remove all but current parts
  removeUnused(parsedXML, "score-partwise", "part", partId);

  // Transpose
  const finger = settingsManager.getFingering();
  transpose(parsedXML, state.pitch, state.octave, finger);

  return parsedXML;
};

/** Extracts a list with the part information from the XML score. */
export const getParts = (xml: Document) => {
  const scorePwXml = getSingleXml(xml, "score-partwise");
  const parts = [];
  const els = scorePwXml.getElementsByTagName("score-part");

  for (const element of els) {
    parts.push({
      id: element.id,
      name: element.getElementsByTagName("part-name")[0].textContent,
    });
  }
  return parts;
};

/** Load pitch information from localStorage. */
const getPitch = () => {
  return settingsManager.getInstrumentKey();
};

/** The moving sheet music including the part selector and the player. */
export const PartSelector = ({
  scoreInfo,
  player,
}: {
  scoreInfo: ScoreInfo;
  player: Player;
}) => {
  const fileName = `/mxl/${scoreInfo.fileName}.musicxml`;
  const mscComUrl = `https://musescore.com/user/83726533/scores/${scoreInfo.source}`;

  const fav = useFavoriteOption();
  const { t } = usePathTranslation();
  const [origXmlAndParts, setOrigXmlAndParts] =
    useState<null | PartSelectorState>(null);

  useEffect(() => {
    // Load XML sheet music from musicxml file and initialize state
    const loadLocal = async () => {
      const xmlTxt = await loadXmlFile(fileName);
      const parsedXML = parseXml(xmlTxt);

      const baseState = {
        xml: parsedXML,
        parts: getParts(parsedXML),
        currPartIdx: 0,
        origXml: parsedXML,
        pitch: getPitch(),
        octave: 0,
      };
      setOrigXmlAndParts({
        ...baseState,
        xml: extractPartXml(baseState),
      });
    };
    loadLocal();
  }, [fileName]);

  if (origXmlAndParts !== null) {
    const currPitch = origXmlAndParts.pitch;
    const currPartIdx = origXmlAndParts.currPartIdx;
    const currOctave = origXmlAndParts.octave;

    // Part changer
    const setPart = (
      newPartIdx: number,
      newPitch: string,
      newOctave: number,
    ) => {
      if (
        newPartIdx === currPartIdx &&
        newPitch === currPitch &&
        newOctave === currOctave
      ) {
        return;
      }
      const newXmlAndParts = {
        ...origXmlAndParts,
        currPartIdx: newPartIdx,
        pitch: newPitch,
        octave: newOctave,
      };
      const xml = extractPartXml(newXmlAndParts);
      setOrigXmlAndParts({
        ...newXmlAndParts,
        xml: xml,
        currPartIdx: newPartIdx,
      });
    };

    // Octave selector
    const octToStr = (el: number) => (el > 0 ? `+${el}` : `${el}`);
    const octaveChooser = (
      <select
        aria-label={t("octave")}
        value={currOctave}
        onChange={(e) =>
          setPart(currPartIdx, currPitch, Number.parseInt(e.target.value))
        }
      >
        {allOctaves.map((el) => (
          <option key={el} value={el}>
            {`${t("octave")}: ${octToStr(el)}`}
          </option>
        ))}
      </select>
    );

    // Pitch selector
    const keyTxt = t("instrumentKeyShort");
    const pitchSelector = (
      <select
        aria-label={t("instrumentKey")}
        value={currPitch}
        onChange={(e) => setPart(currPartIdx, e.target.value, currOctave)}
      >
        {transposeKeys.map((el) => (
          <option key={el} value={el}>
            {`${keyTxt}: ${el}`}
          </option>
        ))}
      </select>
    );

    // Button for adding the current piece to the favorites
    const favOpt = fav.options[0];
    const favInfo = resolveOption(favOpt, scoreInfo.videoId);
    const addToFavButt = (
      <button
        onClick={() => favOpt.onClick(scoreInfo.videoId)}
        title={favInfo.name}
        aria-label={favInfo.name}
        {...getButtonAttrs("40px")}
      >
        {favInfo.icon}
      </button>
    );

    const partSelectorDD = (
      <div style={{ ...flexCentered, flexWrap: "wrap", gap: "0.5em" }}>
        {addToFavButt}
        {pitchSelector}
        {octaveChooser}
      </div>
    );

    // Sheet music
    const score = (
      <MovingSheet
        xml={origXmlAndParts.xml}
        measureMap={scoreInfo.measureMap}
        getTime={player.getTime}
        key={fileName}
      ></MovingSheet>
    );

    // Info about current part and pitch and dropdown for changing
    const partInfo = (
      <div
        style={{
          width: playerSizePx.width,
          maxWidth: playerSizePx.maxWidth,
          margin: "auto",
        }}
      >
        <div style={{ ...containerInner, ...distributedStyle }}>
          <h4>
            {t("viewSheetsOn")}
            <br></br>
            <a href={mscComUrl} target="_blank">
              MuseScore.com
            </a>
          </h4>
          {partSelectorDD}
        </div>
      </div>
    );

    const pieceInfo = (
      <div
        style={{
          width: playerSizePx.width,
          maxWidth: playerSizePx.maxWidth,
          margin: "auto",
        }}
      >
        <div style={{ ...containerInner, ...distributedStyle }}>
          <h3>{scoreInfo.name}</h3>
          <h3>-</h3>
          <h3>{scoreInfo.artist}</h3>
        </div>
      </div>
    );

    // Put all together
    return (
      <>
        {pieceInfo}
        {player.comp}
        {partInfo}
        {score}
        {fav.overlay}
      </>
    );
  }
  return <Loading addComp={true} />;
};
