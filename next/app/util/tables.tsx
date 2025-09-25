import Link from "next/link";

const tableRowMargin = "6px";

export const tableRowHeight = "80px";
export const leftTdStyle = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingRight: 0,
  paddingLeft: 0,
};
export const tdStyle = {
  ...leftTdStyle,
  paddingLeft: ".4em",
};

const noSpace = {
  padding: 0,
  margin: 0,
};
export const tableLinkStyle = {
  font: "inherit",
  color: "inherit",
  textDecoration: "none",
  height: tableRowHeight,
  display: "block",
  ...noSpace,
};
export const thStyle: React.CSSProperties = { textAlign: "left", ...tdStyle };

/** Wrap table cell such that it links to the provided link. */
export const wrapLinkedCell = (
  inner: React.ReactNode,
  link: string,
  openNewTab: boolean = false
) => {
  const linkArgs = openNewTab
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Link style={tableLinkStyle} href={link} {...linkArgs}>
      <div
        style={{
          height: tableRowHeight,
          alignContent: "center",
        }}
      >
        {inner}
      </div>
    </Link>
  );
};

export const BasicTable = (props: {
  header: React.ReactNode;
  body: React.ReactNode;
}) => {
  // Put in a div that makes only the table
  // horizontally scrollable.
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          overflowX: "auto",
          borderSpacing: `0 ${tableRowMargin}`,
        }}
      >
        <thead style={{ width: "100%" }}>
          <tr style={{ width: "100%" }}>{props.header}</tr>
        </thead>
        <tbody>{props.body}</tbody>
      </table>
    </div>
  );
};
