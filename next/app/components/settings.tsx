"use client";

import usePathTranslation from "@/i18n/hook";

import { useDropDown } from "../util/dropdown";
import { FingerType, transposeKeys } from "../util/util";
import useMounted from "../hooks/mounted";

class SettingsManager {
  clefOptions = ["trebleClef", "bassClef"];
  clefKey = "clef";

  instrumentKeyKey = "instrumentKey";

  fingeringKey = "fingering";
  fingeringOptions = ["fingerNone", "fingerThreeValves", "fingerTrombone"];

  sheetModeKey = "sheetMoveMode";
  sheetModeOptions = ["horizontalMode", "verticalMode"];

  scaleKey = "sheetZoom";
  scaleOptions = [0.5, 0.75, 1, 1.5, 2.0];

  /** This is needed for pre-rendering pages. */
  private getStorage() {
    return typeof window !== "undefined" ? window.localStorage : null;
  }

  private get(key: string, values: string[], defaultPos = 0) {
    const ret = this.getStorage()?.getItem(key);
    return ret ?? values[defaultPos];
  }

  /** Handling clef selection. */
  getClef() {
    return this.get(this.clefKey, this.clefOptions);
  }

  private setClef(newClef: string) {
    this.getStorage()?.setItem(this.clefKey, newClef);
  }

  getClefOptions(t: any) {
    return this.clefOptions.map((el) => {
      return { name: t(el), onClick: () => this.setClef(el), key: el };
    });
  }

  /** Handling instrument key selection. */
  getInstrumentKey() {
    return this.get(this.instrumentKeyKey, transposeKeys);
  }

  private setInstrumentKey(newKey: string) {
    localStorage.setItem(this.instrumentKeyKey, newKey);
  }

  getInstrumentKeyOptions() {
    return transposeKeys.map((el) => {
      return { name: el, onClick: () => this.setInstrumentKey(el), key: el };
    });
  }

  /** Handling fingering selection. */
  getFingering() {
    return this.get(this.fingeringKey, this.fingeringOptions) as FingerType;
  }
  private setFingering(newf: string) {
    localStorage.setItem(this.fingeringKey, newf);
  }
  getFingeringOptions(t: any) {
    return this.fingeringOptions.map((el) => {
      return { name: t(el), onClick: () => this.setFingering(el), key: el };
    });
  }

  /** Handling fingering selection. */
  private zoomOpts() {
    return this.scaleOptions.map((el) => `${el}`);
  }
  getZoom() {
    const zoomFacStr = this.get(this.scaleKey, this.zoomOpts(), 2);
    return Number(zoomFacStr);
  }
  private setZoom(newZoom: string) {
    localStorage.setItem(this.scaleKey, newZoom);
  }
  getZoomOptions(t: any) {
    return this.zoomOpts().map((el) => {
      return { name: t(el), onClick: () => this.setZoom(el), key: el };
    });
  }

  /** Handling sheet view mode */
  getSheetMode() {
    return this.get(this.sheetModeKey, this.sheetModeOptions);
  }
  private setSheetMode(newMode: string) {
    localStorage.setItem(this.sheetModeKey, newMode);
  }
  getSheetOptions(t: any) {
    return this.sheetModeOptions.map((el) => {
      return { name: t(el), onClick: () => this.setSheetMode(el), key: el };
    });
  }
  isHorizontalMode() {
    return this.getSheetMode() === "horizontalMode";
  }
}

// Setting manager singleton instance.
export const settingsManager = new SettingsManager();

const SettingsComp = () => {
  const { t } = usePathTranslation();

  const mounted = useMounted();

  const keyOptions = settingsManager.getInstrumentKeyOptions();
  const currKey = mounted ? settingsManager.getInstrumentKey() : null;
  const keyDD = useDropDown(currKey, keyOptions);

  const options = settingsManager.getClefOptions(t);
  const currClefName = mounted ? t(settingsManager.getClef()) : null;
  const clefDD = useDropDown(currClefName, options);

  const fingerOptions = settingsManager.getFingeringOptions(t);
  const currFingerName = mounted ? t(settingsManager.getFingering()) : null;
  const fingerDD = useDropDown(currFingerName, fingerOptions);

  const zoomOptions = settingsManager.getZoomOptions(t);
  const currZoom = mounted ? settingsManager.getZoom() : null;
  const zoomDD = useDropDown(currZoom, zoomOptions);

  const sheetOptions = settingsManager.getSheetOptions(t);
  const currSheetMode = mounted ? t(settingsManager.getSheetMode()) : null;
  const sheetDD = useDropDown(currSheetMode, sheetOptions);

  return (
    <>
      <h4>{t("settingsTitle")}</h4>
      <div className="row" style={{ marginBottom: "0.2em" }}>
        <div className="twocols">{t("instrumentKey")}</div>
        <div className="twocols rightcol">{keyDD}</div>
      </div>
      <div className="row" style={{ marginBottom: "0.2em" }}>
        <div className="twocols">{t("clef")}</div>
        <div className="twocols rightcol">{clefDD}</div>
      </div>
      <div className="row" style={{ marginBottom: "0.2em" }}>
        <div className="twocols">{t("fingering")}</div>
        <div className="twocols rightcol">{fingerDD}</div>
      </div>
      <div className="row" style={{ marginBottom: "0.2em" }}>
        <div className="twocols">{t(settingsManager.scaleKey)}</div>
        <div className="twocols rightcol">{zoomDD}</div>
      </div>
      <div className="row" style={{ marginBottom: "0.2em" }}>
        <div className="twocols">{t(settingsManager.sheetModeKey)}</div>
        <div className="twocols rightcol">{sheetDD}</div>
      </div>
    </>
  );
};

export default SettingsComp;
