"use client";

import { useReducer } from "react";

import usePathTranslation from "@/i18n/hook";

import useMounted from "../hooks/mounted";
import { FingerType, transposeKeys } from "../util/util";

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
export const twoColumns: React.CSSProperties = { float: "left", width: "50%" };

// Setting manager singleton instance.
export const settingsManager = new SettingsManager();

type SettingOption = { name: string; onClick: VoidFunction; key: string };

/** A labelled setting with a native select. */
const SettingRow = (props: {
  label: string;
  options: SettingOption[];
  current: string | null; // null until the stored setting is loaded
  onChanged: VoidFunction;
}) => {
  const { label, options, current, onChanged } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1em",
        marginBottom: "0.4em",
      }}
    >
      <label>{label}</label>
      <select
        aria-label={label}
        style={{ minWidth: "10em" }}
        value={current ?? options[0].key}
        onChange={(e) => {
          options.find((el) => el.key === e.target.value)?.onClick();
          onChanged();
        }}
      >
        {options.map((el) => (
          <option key={el.key} value={el.key}>
            {el.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const SettingsComp = () => {
  const { t } = usePathTranslation();
  const mounted = useMounted();

  // The settings are stored in the local storage, re-render after a change.
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const current = (getter: () => string | number) =>
    mounted ? `${getter()}` : null;

  const rows = [
    {
      label: t("instrumentKey"),
      options: settingsManager.getInstrumentKeyOptions(),
      current: current(() => settingsManager.getInstrumentKey()),
    },
    {
      label: t("clef"),
      options: settingsManager.getClefOptions(t),
      current: current(() => settingsManager.getClef()),
    },
    {
      label: t("fingering"),
      options: settingsManager.getFingeringOptions(t),
      current: current(() => settingsManager.getFingering()),
    },
    {
      label: t(settingsManager.scaleKey),
      options: settingsManager.getZoomOptions(t),
      current: current(() => settingsManager.getZoom()),
    },
    {
      label: t(settingsManager.sheetModeKey),
      options: settingsManager.getSheetOptions(t),
      current: current(() => settingsManager.getSheetMode()),
    },
  ];

  return (
    <>
      <h4>{t("settingsTitle")}</h4>
      {rows.map((row) => (
        <SettingRow key={row.label} {...row} onChanged={rerender} />
      ))}
    </>
  );
};

export default SettingsComp;
