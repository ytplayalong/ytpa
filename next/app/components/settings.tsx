"use client";

import usePathTranslation from "@/i18n/hook";
import { twoColumns } from "../util/styles";
import { useDropDown } from "../util/dropdown";
import { FingerType, transposeKeys } from "../util/util";

class SettingsManager {
  clefOptions = ["trebleClef", "bassClef"];
  clefKey = "clef";

  instrumentKeyKey = "instrumentKey";

  fingeringKey = "fingering";
  fingeringOptions = ["fingerNone", "fingerThreeValves", "fingerTrombone"];

  /** This is needed for pre-rendering pages. */
  private getStorage() {
    return typeof window !== "undefined" ? window.localStorage : null;
  }

  private get(key: string, values: string[]) {
    const ret = this.getStorage()?.getItem(key);
    return ret ? ret : values[0];
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

  return (
    <>
      <h4>{t("settingsTitle")}</h4>
      <div className="row">
        <div style={twoColumns}>{t("instrumentKey")}</div>
        <div style={twoColumns}>{keyDD}</div>
        <div style={twoColumns}>{t("clef")}</div>
        <div style={twoColumns}>{clefDD}</div>
        <div style={twoColumns}>{t("fingering")}</div>
        <div style={twoColumns}>{fingerDD}</div>
      </div>
    </>
  );
};
export default SettingsComp;
