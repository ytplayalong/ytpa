export const borderRadius = "8px";

// The colors and borders of buttons are defined in globals.css (.btn),
// here is only the layout.
const buttonStyle: React.CSSProperties = {
  padding: "0.5em",
  minWidth: "120px",
  height: "2.5em",
  fontSize: "inherit",
  fontFamily: "inherit",
  display: "flex",
  justifyContent: "center", // horizontal alignment
  alignItems: "center",
};

export const buttonAttrs = { style: buttonStyle, className: "btn" };
export const buttonAttrsClass = (style: object, className: string = "") => {
  return {
    style: { ...buttonStyle, ...style },
    className: `btn ${className}`.trim(),
  };
};

/** Highlighted button for the main action, e.g. submit. */
export const primaryButtonAttrs = {
  ...buttonAttrs,
  className: "btn primary",
};

export const getButtonAttrs = (width: string) => {
  return { ...buttonAttrs, style: { ...buttonStyle, minWidth: width } };
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
