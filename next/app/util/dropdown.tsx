import usePathTranslation from "@/i18n/hook";
import Link from "next/link";
import { useState } from "react";

const ddStyle: any = { position: "relative", display: "inline-block" };
const ddButtonStyle: any = { border: "none", cursor: "pointer" };
const ddContentStyle: any = { position: "absolute", zIndex: 1 };
const elementStyle = { textDecoration: "none", display: "block" };

type DDItem = { name: any; key: string; url?: string; onClick?: VoidFunction };
type DdProps = { options: DDItem[] };

export const useDropDown = (label: any, options: DDItem[]) => {
  const [isShown, setIsShown] = useState(false);
  const { getLink } = usePathTranslation();

  const contStyle = { ...ddContentStyle, display: isShown ? "block" : "none" };
  const onClick = () => setIsShown(!isShown);

  return (
    <div style={ddStyle}>
      <button style={ddButtonStyle} onClick={onClick}>
        {label} ▾
      </button>
      <div style={contStyle}>
        {options.map((el) => {
          if (el.url) {
            return (
              <Link href={getLink(el.url)} style={elementStyle} key={el.key}>
                {el.name}
              </Link>
            );
          }
          const onClick = () => {
            el.onClick!();
            setIsShown(false);
          };
          return (
            <button style={elementStyle} onClick={onClick} key={el.key}>
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
