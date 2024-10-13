import { useEffect, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import MonotonicCubicSpline from "../util/cubicSpline";
import { MeasureMap } from "../util/util";
import useWindowDimensions from "../hooks/windowSize";
import { settingsManager } from "./settings";

const fullW = 40000;
const screenAnchorFactor = 0.3;
const osmdId = "osmd";
const baseHeight = 260;

class MyOSMD extends OpenSheetMusicDisplay {
  setup() {
    // Fingering below does not seem to work...
    this.rules.FingeringPosition = 1;
    this.rules.FingeringOffsetY = 1;
    this.rules.FingeringPositionFromXML = false;
  }
}

/** Load the score from the xml. */
const loadOsmd = async (
  xml: Document,
  width: number,
  height: number,
  zoomFac: number
) => {
  const osmd = new MyOSMD(osmdId, {
    drawCredits: false,
    drawPartNames: false,
    measureNumberInterval: 4,
  });
  osmd.setup();

  await osmd.load(xml);
  osmd.setCustomPageFormat(width, height);
  osmd.Zoom = zoomFac;
  osmd.render();
  return osmd;
};

/** Creates an interpolator function that maps from seconds to x position. */
const getInterpolator = (
  osmd: OpenSheetMusicDisplay,
  measureMap: MeasureMap
) => {
  const measureList = osmd.GraphicSheet.MeasureList;
  let measureXList = measureList.map((el) => (el[0] as any)?.stave.x);

  if (!settingsManager.isHorizontalMode()) {
    let measureYList = measureList.map((el) => (el[0] as any)?.stave.y);
    const defaultYOffset = measureYList[0];
    measureYList = measureYList.map((el) => el - defaultYOffset);

    let infoList: { [key: number]: number } = {};
    let currCt = 0;
    let currEl = measureYList[0];
    measureYList.forEach((el) => {
      if (el === currEl) {
        currCt += 1;
      } else {
        infoList[currEl] = currCt;
        currEl = el;
        currCt = 1;
      }
    });

    currEl = measureYList[0];
    let currNum = infoList[currEl];
    let currHeight = 0;
    let lastBreakIdx = 0;
    measureYList.forEach((el, ct) => {
      if (el !== currEl) {
        lastBreakIdx = ct - 1;
        currHeight = el - currEl;
        currEl = el;
      }
      measureYList[ct] -=
        ((currNum - ct + lastBreakIdx + 1) * currHeight) / (currNum + 1);
    });
    measureXList = measureYList;
  }

  const mmEntries = Object.entries(measureMap);
  let numEntries = mmEntries.map(
    (timeAndBar) => [parseFloat(timeAndBar[0]), timeAndBar[1]] as const
  );
  numEntries.sort((a, b) => a[0] - b[0]);

  // Add start and end entries
  const lastEntry = numEntries[numEntries.length - 1];
  const endEntries = [1, 2].map((el) => {
    return [lastEntry[0] + el * 5, lastEntry[1]] as const;
  });
  const start = [0, 0] as readonly [number, number];
  numEntries = [start].concat(numEntries).concat(endEntries);

  const nEntries = numEntries.length;
  let [currSec, currMeasIdx] = numEntries[0];

  const secs = [];
  const xVals = [];
  for (let k = 0; k < nEntries - 1; ++k) {
    let [nextSec, nextMeasIdx] = numEntries[k + 1];
    const nextX = measureXList[nextMeasIdx - 1];
    if (nextX === undefined) {
      continue;
    }
    // Do stuff
    for (let i = currMeasIdx; i < nextMeasIdx; ++i) {
      const x = measureXList[i - 1];
      if (x !== undefined) {
        const ipSecs =
          currSec +
          ((nextSec - currSec) * (i - currMeasIdx)) /
            (nextMeasIdx - currMeasIdx);
        secs.push(ipSecs);
        xVals.push(x);
      }
    }

    currSec = nextSec;
    currMeasIdx = nextMeasIdx;
  }
  secs.push(currSec);
  xVals.push(measureXList[currMeasIdx - 1]);

  console.log(secs, xVals);
  const anchorFactor = settingsManager.isHorizontalMode()
    ? screenAnchorFactor
    : 0;

  // Create a Spline object
  const spline = new MonotonicCubicSpline(secs, xVals);
  return (val: number, fac: number) => {
    const offset = anchorFactor * window.innerWidth;
    return Math.max(0, spline.interpolate(val) * fac - offset);
  };
};

/** The sheet music component. */
export const MovingSheet = (props: {
  xml: Document;
  measureMap: MeasureMap;
  getTime: () => Promise<number>;
}) => {
  const [currPos, setCurrPos] = useState({ x: 0, y: 0 });
  const [ipOrNull, setIpOrNull] = useState<{
    ip: (n: number, fac: number) => number;
  } | null>(null);

  // Height based on window height
  const { height } = useWindowDimensions();
  const userZoom = settingsManager.getZoom();
  const sheetHeightPerc = 0.2;
  const sheetHeigthPx = Math.max(150, sheetHeightPerc * height);
  const zoomFac =
    Math.max(Math.min(1, sheetHeigthPx / baseHeight), 0.5) * userZoom;
  const acutalSheetHeight = sheetHeigthPx * zoomFac;
  const sheetWidth = settingsManager.isHorizontalMode()
    ? fullW * acutalSheetHeight
    : window.innerWidth;

  const { getTime, measureMap, xml } = props;

  useEffect(() => {
    // Load the sheet music display and create interpolator.
    const loadLocal = async () => {
      const osmdPageHeight = settingsManager.isHorizontalMode()
        ? sheetHeigthPx * userZoom
        : 100000;
      const osmd = await loadOsmd(xml, sheetWidth, osmdPageHeight, zoomFac);
      const ipObj = getInterpolator(osmd, measureMap);
      setIpOrNull({ ip: ipObj });
    };
    loadLocal();
    return () => {
      setIpOrNull(null);
    };
  }, [xml, measureMap, sheetHeigthPx, userZoom, sheetWidth]);

  useEffect(() => {
    // Register callback that adjusts the sheet according to the video
    if (ipOrNull !== null) {
      const ipObj = ipOrNull.ip;
      const interval = setInterval(async () => {
        const elapsedSec = await getTime();
        const position = ipObj(elapsedSec, zoomFac);
        const posObj = settingsManager.isHorizontalMode()
          ? { x: position, y: 0 }
          : { x: 0, y: position };
        setCurrPos(posObj);
      }, 20); // ms refresh.

      return () => {
        clearInterval(interval);
      };
    }
  }, [getTime, ipOrNull, zoomFac]);

  const componentHeight = settingsManager.isHorizontalMode()
    ? sheetHeigthPx * userZoom
    : 800;
  return (
    <div style={{ overflow: "hidden" }}>
      <div
        id={osmdId}
        style={{
          height: `${componentHeight + currPos.y}px`,
          width: `${sheetWidth}px`,
          marginLeft: `-${currPos.x}px`,
          marginTop: `-${currPos.y}px`,
        }}
      ></div>
    </div>
  );
};
