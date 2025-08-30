import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { useEffect, useState } from "react";

import useWindowDimensions from "../hooks/windowSize";
import MonotonicCubicSpline from "../util/cubicSpline";
import { MeasureMap } from "../util/util";
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
  osmd: MyOSMD,
  width: number,
  height: number,
  zoomFac: number
) => {
  osmd.setCustomPageFormat(width, height);
  osmd.Zoom = zoomFac;
  if (!osmd.IsReadyToRender()) {
    console.warn("Should not render");
  }
  osmd.render();
  return osmd;
};

const range = (start: number, stop: number, nElements: number) => {
  const arr = new Array(nElements);
  return [...arr].map((_, ct) => start + ((stop - start) * ct) / nElements);
};

/** Creates an interpolator function that maps from seconds to x position. */
const getInterpolator = (
  osmd: OpenSheetMusicDisplay,
  measureMap: MeasureMap
) => {
  const measureList = osmd.GraphicSheet.MeasureList;
  let measureXList = measureList.map((el) => (el[0] as any)?.stave.x);

  // Retrieve anchors from json
  const mmEntries = Object.entries(measureMap);
  let numEntries = mmEntries.map(
    (timeAndBar) => [parseFloat(timeAndBar[0]), timeAndBar[1]] as const
  );
  numEntries.sort((a, b) => a[0] - b[0]);
  const start = [0, 0] as readonly [number, number];
  numEntries = [start].concat(numEntries); // Add start entries

  if (!settingsManager.isHorizontalMode()) {
    // Move the sheet upwards
    let measureYList = measureList.map((el) => (el[0] as any)?.stave.y);
    const defaultYOffset = measureYList[0];
    measureYList = measureYList.map((el) => el - defaultYOffset);

    // Choose anchors, first bars of the lines
    let prevVal = 0;
    let lineAnchors: any = [[0, 0]];
    let yValBetter: number[] = [];
    measureYList.forEach((el, ct) => {
      if (isNaN(el)) {
        console.log("Found Nan :(");
        return; // Ignore
      }
      if (el != prevVal) {
        const prevAnchor = lineAnchors[lineAnchors.length - 1];
        const newRange = range(prevAnchor[1], prevVal, ct - prevAnchor[0]);
        yValBetter = yValBetter.concat(newRange);
        lineAnchors.push([ct, prevVal]);
      }
      prevVal = el;
    });

    // Handle end separately
    const lastAnchor = lineAnchors[lineAnchors.length - 1];
    const lastMeasIdx = measureYList.length - 1;
    if (lastAnchor[0] != lastMeasIdx) {
      lineAnchors.push([lastMeasIdx, prevVal]);
      const newRange = range(
        lastAnchor[1],
        prevVal,
        lastMeasIdx - lastAnchor[0]
      );
      yValBetter = yValBetter.concat(newRange);
      yValBetter.push(prevVal);
    } else {
      // Last line only contains one bar
      yValBetter.push(lastAnchor[1]);
    }

    // TODO: Interpolate lines linearly regardless of bars.
    measureXList = yValBetter;
  }

  const nEntries = numEntries.length;
  let [currSec, currMeasIdx] = numEntries[0];

  const secs: number[] = [];
  const xVals: number[] = [];
  for (let k = 0; k < nEntries - 1; ++k) {
    let [nextSec, nextMeasIdx] = numEntries[k + 1];
    const nextX = measureXList[nextMeasIdx - 1];
    if (nextX === undefined) {
      continue;
    }
    // Interpolate each bar linearly between anchors
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

  // Constant extension, makes sheet stop gracefully
  [1, 2].forEach((ct) => {
    secs.push(currSec + ct * 5);
    xVals.push(measureXList[currMeasIdx - 1]);
  });

  const anchorFactor = settingsManager.isHorizontalMode()
    ? screenAnchorFactor
    : 0;

  // Create a Spline object
  const spline = new MonotonicCubicSpline(secs, xVals);
  return (val: number, fac: number) => {
    // Handle extrapolation
    let ipVal;
    if (val <= secs[0]) {
      ipVal = xVals[0];
    } else if (val >= secs[secs.length - 1]) {
      ipVal = xVals[xVals.length - 1];
    } else {
      // Ok, within interpolation interval
      ipVal = spline.interpolate(val);
    }
    const offset = anchorFactor * window.innerWidth;
    return Math.max(0, ipVal * fac - offset);
  };
};

/** The sheet music component. */
export const MovingSheet = (props: {
  xml: Document;
  measureMap: MeasureMap;
  getTime: () => Promise<number>;
}) => {
  const [osmd, setOsmd] = useState<MyOSMD | null>(null);
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
    const loadOsmd = async () => {
      const osmd = new MyOSMD(osmdId, {
        drawCredits: false,
        drawPartNames: false,
        measureNumberInterval: 4,
      });
      osmd.setup();
      await osmd.load(xml);
      setOsmd(osmd);
    };

    loadOsmd();
  }, [xml]);

  useEffect(() => {
    // Load the sheet music display and create interpolator.
    if (osmd != null) {
      const loadLocal = async () => {
        const osmdPageHeight = settingsManager.isHorizontalMode()
          ? sheetHeigthPx * userZoom
          : 100000;
        await loadOsmd(osmd, sheetWidth, osmdPageHeight, zoomFac);
        const ipObj = getInterpolator(osmd, measureMap);
        setIpOrNull({ ip: ipObj });
      };
      loadLocal();
    }
    return () => {
      setIpOrNull(null);
    };
  }, [osmd, measureMap, sheetHeigthPx, userZoom, zoomFac, sheetWidth]);

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
