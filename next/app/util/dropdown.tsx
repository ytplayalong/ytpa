import Link from "next/link";
import { useState } from "react";

import usePathTranslation from "@/i18n/hook";

import { borderRadius, buttonAttrs, buttonAttrsClass } from "./styles";

const ddStyle: React.CSSProperties = {
  position: "relative",
  display: "inline-block",
};

const ddContentStyle: React.CSSProperties = { position: "absolute", zIndex: 1 };
const elementStyle = buttonAttrsClass({
  textDecoration: "none",
  display: "block",
  borderRadius: 0,
  backgroundColor: "#eee",
});

type DDItem = { name: any; key: string; url?: string; onClick?: VoidFunction };
type DdProps = { options: DDItem[]; wrapper?: any };

const defaultWrapper = (el: React.ReactElement, onClick: VoidFunction) => {
  return (
    <button {...buttonAttrs} onClick={onClick}>
      {el} ▾
    </button>
  );
};

export const useDropDown = (
  label: any,
  options: DDItem[],
  wrapper = defaultWrapper
) => {
  const [isShown, setIsShown] = useState(false);
  const { getLink } = usePathTranslation();

  const contStyle = { ...ddContentStyle, display: isShown ? "block" : "none" };
  const onClick = () => setIsShown(!isShown);

  return (
    <div style={ddStyle}>
      {wrapper(label, onClick)}
      <div style={contStyle}>
        {options.map((el, idx) => {
          let usedStyle = { ...elementStyle, style: { ...elementStyle.style } };
          if (idx === options.length - 1) {
            usedStyle.style["borderBottomLeftRadius"] = borderRadius;
            usedStyle.style["borderBottomRightRadius"] = borderRadius;
          } else {
            usedStyle.style["borderBottom"] = "3px solid #ccc";
          }
          if (el.url) {
            return (
              <Link href={getLink(el.url)} {...usedStyle} key={el.key}>
                {el.name}
              </Link>
            );
          }
          const onClick = () => {
            el.onClick!();
            setIsShown(false);
          };
          return (
            <button {...usedStyle} onClick={onClick} key={el.key}>
              {el.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

type MultiDDItem = {
  name: any;
  key: string;
  onClick: (key: string) => void;
};

/** Multi-use dropdown menu.
 *
 * Returns a function that takes a key and creates a dropdown component.
 * This key is passed to the onClick handlers.
 * Using this function, many dropdowns can be created and used in the same component.
 */
export const useMultiDropDown = (
  label: any,
  options: MultiDDItem[],
  wrapper = defaultWrapper,
  baseElementStyle: React.CSSProperties = {}
) => {
  const [isShown, setIsShown] = useState<string | null>(null);

  const compCreator = (key: string) => {
    const toggleDd = () => setIsShown(isShown == key ? null : key);
    const contStyle = {
      ...ddContentStyle,
      display: isShown == key ? "block" : "none",
    };
    return (
      <div style={{ ...ddStyle, ...baseElementStyle }}>
        {wrapper(label, toggleDd)}
        <div style={contStyle}>
          {options.map((el, idx) => {
            let usedStyle = {
              ...elementStyle,
              style: { ...elementStyle.style },
            };
            if (idx === options.length - 1) {
              usedStyle.style["borderBottomLeftRadius"] = borderRadius;
              usedStyle.style["borderBottomRightRadius"] = borderRadius;
            } else {
              usedStyle.style["borderBottom"] = "3px solid #ccc";
            }
            const onClick = () => {
              el.onClick(key);
              setIsShown(null);
            };
            return (
              <button {...usedStyle} onClick={onClick} key={el.key}>
                {el.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  return compCreator;
};

export const DropdownComp = (props: React.PropsWithChildren<DdProps>) => {
  return useDropDown(props.children, props.options, props.wrapper);
};
