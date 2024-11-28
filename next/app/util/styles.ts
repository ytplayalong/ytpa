import { buttonColor } from "./colors";

export const borderRadius = "6px";
const buttonStyle: any = {
  border: "none",
  cursor: "pointer",
  padding: "0.5em",
  minWidth: "100px",
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

export const inputStyle: any = {
  boxSizing: "border-box",
  width: "100%",
  minHeight: "40px",
  borderRadius,
};

export const distributedStyle = {
  justifyContent: "space-between",
  display: "flex",
};
export const flexCentered: any = {
  display: "flex",
  justifyContent: "center",
  textAlign: "center",
  alignItems: "center",
};

export const containerInner: any = {
  padding: "8px",
};

export const containerInnerLeftRight: any = {
  paddingLeft: "8px",
  paddingRight: "8px",
};
