"use client";

import usePathTranslation from "@/i18n/hook";
import { useDropDown } from "../util/dropdown";
import { FingerType, transposeKeys } from "../util/util";

class SettingsManager {
  clefOptions = ["trebleClef", "bassClef"];
  clefKey = "clef";

  instrumentKeyKey = "instrumentKey";

  fingeringKey = "fingering";
  fingeringOptions = ["fingerNone", "fingerThreeValves", "fingerTrombone"];

  scaleKey = "sheetZoom";
  scaleOptions = [0.5, 0.75, 1, 1.5, 2.0];

  /** This is needed for pre-rendering pages. */
  private getStorage() {
    return typeof window !== "undefined" ? window.localStorage : null;
  }

  private get(key: string, values: string[], defaultPos = 0) {
    const ret = this.getStorage()?.getItem(key);
    return ret ? ret : values[defaultPos];
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
}

export const settingsManager = new SettingsManager();

const SettingsComp = () => {
  const { t } = usePathTranslation();

  const keyOptions = settingsManager.getInstrumentKeyOptions();
  const keyDD = useDropDown(settingsManager.getInstrumentKey(), keyOptions);

  const options = settingsManager.getClefOptions(t);
  const currClefName = t(settingsManager.getClef());
  const clefDD = useDropDown(currClefName, options);

  const fingerOptions = settingsManager.getFingeringOptions(t);
  const currFingerName = t(settingsManager.getFingering());
  const fingerDD = useDropDown(currFingerName, fingerOptions);

  const zoomOptions = settingsManager.getZoomOptions(t);
  const currZoom = settingsManager.getZoom();
  const zoomDD = useDropDown(currZoom, zoomOptions);

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
    </>
  );
};
export default SettingsComp;
