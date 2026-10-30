import Link from "next/link";

export const tableRowHeight = "80px";
export const leftTdStyle = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingRight: 0,
  paddingLeft: 0,
};
// The thumbnails (4:3) are shown with the height of the row, the column must
// not become narrower than the image, else it is squeezed on small screens.
export const thumbWidth = "107px"; // 4/3 * tableRowHeight
export const thumbTdStyle = { ...leftTdStyle, minWidth: thumbWidth };
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
export const thumbThStyle: React.CSSProperties = {
  ...thStyle,
  minWidth: thumbWidth,
};

/** Text in a table cell that is cut off with "..." after two lines.
 *
 * The full text is the tooltip (title) of the cell.
 */
export const clampText = (content: React.ReactNode, title?: string) => (
  <span className="clamp" title={title}>
    {content}
  </span>
);

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
  // The wrapper makes only the table horizontally scrollable.
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{props.header}</tr>
        </thead>
        <tbody>{props.body}</tbody>
      </table>
    </div>
  );
};
