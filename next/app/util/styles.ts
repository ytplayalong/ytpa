import { buttonColor } from "./colors";

export const borderRadius = "6px";
const buttonStyle: React.CSSProperties = {
  border: "none",
  cursor: "pointer",
  padding: "0.5em",
  minWidth: "120px",
  fontSize: "inherit",
  fontFamily: "inherit",
  borderRadius,
  backgroundColor: buttonColor,
};
// The button's hover color is defined in the CSS file

export const buttonAttrs = { style: buttonStyle, className: "hoverlink" };
export const buttonAttrsClass = (style: object, className: string = "") => {
  return {
    style: { ...buttonStyle, ...style },
    className: `hoverlink ${className}`,
  };
};

export const inputStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  minHeight: "40px",
  borderRadius,
};

export const distributedStyle: React.CSSProperties = {
  justifyContent: "space-between",
  display: "flex",
};
export const flexCentered: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  textAlign: "center",
  alignItems: "center",
};

export const containerInner: React.CSSProperties = {
  padding: "8px",
};

export const containerInnerLeftRight: React.CSSProperties = {
  paddingLeft: "8px",
  paddingRight: "8px",
};
