import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import usePathTranslation from "@/i18n/hook";

import { borderRadius, buttonAttrs, buttonAttrsClass } from "./styles";

const ddStyle: React.CSSProperties = {
  position: "relative",
  display: "inline-block",
};

export const ddContentStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 1,
  border: "1px solid #ccc",
  borderRadius,
  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
  overflow: "hidden",
};
const elementStyle = buttonAttrsClass({
  textDecoration: "none",
  display: "block",
  borderRadius: 0,
  backgroundColor: "#eee",
});

type DDItem = { name: any; key: string; url?: string; onClick?: VoidFunction };
type DdProps = {
  options: DDItem[];
  wrapper?: any;
  alignRight?: boolean;

const defaultWrapper = (el: React.ReactNode, onClick: VoidFunction) => {
  return (
    <button {...buttonAttrs} onClick={onClick}>
      {el} ▾
    </button>
  );
};

export const useDropDown = (
  label: React.ReactNode,
  options: DDItem[],
  alignRight = false,
  wrapper = defaultWrapper,
) => {
  const [isShown, setIsShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { getLink } = usePathTranslation();

  useEffect(() => {
    if (!isShown) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsShown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isShown]);

  const contStyle = {
    ...ddContentStyle,
    display: isShown ? "block" : "none",
  };
  if (alignRight) {
    contStyle.right = 0;
  }
  const onClick = () => setIsShown(!isShown);
  elementStyle.style.minWidth = 150;

  return (
    <div style={ddStyle} ref={ref}>
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
  name: React.ReactNode;
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
  label: React.ReactNode,
  options: MultiDDItem[],
  wrapper = defaultWrapper,
  baseElementStyle: React.CSSProperties = {},
  alignRight = false,
) => {
  const [isShown, setIsShown] = useState<string | null>(null);
  const refsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!isShown) return;
    const handler = (e: MouseEvent) => {
      const el = refsMap.current.get(isShown);
      if (el && !el.contains(e.target as Node)) {
        setIsShown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isShown]);

  const compCreator = (key: string) => {
    const toggleDd = () => setIsShown(isShown == key ? null : key);
    const contStyle = {
      ...ddContentStyle,
      display: isShown == key ? "block" : "none",
      right: alignRight ? 0 : undefined,
    };
    return (
      <div
        style={{ ...ddStyle, ...baseElementStyle }}
        ref={(el) => {
          if (el) refsMap.current.set(key, el);
          else refsMap.current.delete(key);
        }}
      >
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
  return useDropDown(
    props.children,
    props.options,
    props.alignRight ?? false,
    props.wrapper,
  );
};
