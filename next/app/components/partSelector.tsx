import { useEffect, useState } from "react";
import { MovingSheet } from "./movingSheet";
import {
  MeasureMap,
  Player,
  getSingleXml,
  parseXml,
  playerSizePx,
  transpose,
  transposeKeys,
} from "../util/util";
import { settingsManager } from "./settings";
import { DropdownComp } from "../util/dropdown";
import { distributedStyle, flexCentered } from "../util/styles";
import usePathTranslation from "@/i18n/hook";

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
  partId: string
) => {
  const parEl = getSingleXml(baseEl, parName);
  parEl.childNodes.forEach((el) => {
    if (el.nodeName === childName && (el as any).id !== partId) {
      parEl.removeChild(el);
    }
  });
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
  for (let i = 0; i < els.length; ++i) {
    parts.push({
      id: els[i].id,
      name: els[i].getElementsByTagName("part-name")[0].textContent!,
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
  measureMap,
  player,
  fileName,
  mscComUrl,
}: {
  measureMap: MeasureMap;
  player: Player;
  fileName: string;
  mscComUrl: string;
}) => {
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
      newOctave: number
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

    // Only add part chooser dropdown if there are at least two parts.
    const octToStr = (el: number) => (el > 0 ? `+${el}` : `${el}`);
    const octTitle =
      currOctave === 0 ? "Octave" : `Octave ${octToStr(currOctave)}`;
    const octaveOptions = allOctaves.map((el) => {
      return {
        name: octToStr(el),
        onClick: () => setPart(currPartIdx, currPitch, el),
        key: octToStr(el),
      };
    });
    const octaveChooser = (
      <DropdownComp options={octaveOptions}>{octTitle}</DropdownComp>
    );

    // Pitch selector dropdown
    const pitchSetter = (el: string) => setPart(currPartIdx, el, currOctave);
    const pitchOptions = transposeKeys.map((el, idx) => {
      return {
        name: el,
        onClick: () => pitchSetter(el),
        key: el,
      };
    });
    const pitchSelector = (
      <DropdownComp
        options={pitchOptions}
      >{`Pitch: ${currPitch}`}</DropdownComp>
    );

    // (Part and) pitch selector dropdowns
    const partSelectorDD = (
      <div style={flexCentered}>
        {pitchSelector}
        {octaveChooser}
      </div>
    );

    // Sheet music
    const score = (
      <MovingSheet
        xml={origXmlAndParts.xml}
        measureMap={measureMap}
        getTime={player.getTime}
        key={fileName}
      ></MovingSheet>
    );

    // Info about current part and pitch and dropdown for changing
    const partInfo = (
      <div
        style={{
          ...distributedStyle,
          width: playerSizePx.width,
          margin: "auto",
        }}
      >
        <h4>
          {t("viewSheetsOn")}
          <br></br>
          <a href={mscComUrl} target="_blank">
            MuseScore.com
          </a>
        </h4>
        {partSelectorDD}
      </div>
    );

    // Put all together
    return (
      <>
        {player.comp}
        {partInfo}
        {score}
      </>
    );
  }
  return <div className="container">Loading...</div>;
};
