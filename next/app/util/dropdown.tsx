import usePathTranslation from "@/i18n/hook";
import Link from "next/link";
import { useState } from "react";
import { borderRadius, buttonAttrs, buttonAttrsClass } from "./styles";

const ddStyle: any = { position: "relative", display: "inline-block" };

const ddContentStyle: any = { position: "absolute", zIndex: 1 };
const elementStyle = buttonAttrsClass({
  textDecoration: "none",
  display: "block",
  borderRadius: 0,
  backgroundColor: "#eee",
});

type DDItem = { name: any; key: string; url?: string; onClick?: VoidFunction };
type DdProps = { options: DDItem[] };

export const useDropDown = (label: any, options: DDItem[]) => {
  const [isShown, setIsShown] = useState(false);
  const { getLink } = usePathTranslation();

  const contStyle = { ...ddContentStyle, display: isShown ? "block" : "none" };
  const onClick = () => setIsShown(!isShown);

  return (
    <div style={ddStyle}>
      <button {...buttonAttrs} onClick={onClick}>
        {label} ▾
      </button>
      <div style={contStyle}>
        {options.map((el, idx) => {
          let usedStyle = { ...elementStyle, style: { ...elementStyle.style } };
          if (idx === options.length - 1) {
            usedStyle.style["border-bottom-left-radius"] = borderRadius;
            usedStyle.style["border-bottom-right-radius"] = borderRadius;
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

export const DropdownComp = (props: React.PropsWithChildren<DdProps>) => {
  return useDropDown(props.children, props.options);
};
