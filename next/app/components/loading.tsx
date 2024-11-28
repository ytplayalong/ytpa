import { containerInner } from "../util/styles";

export const Loading = ({
  title,
  addComp,
}: {
  title?: string;
  addComp?: boolean;
}) => {
  const titleComp = title ?? <h4>{title}</h4>;
  const content = (
    <>
      {titleComp}
      <p>Loading...</p>
    </>
  );
  if (addComp) {
    return (
      <div className="container">
        <div style={containerInner}>{content}</div>
      </div>
    );
  }
  return content;
};
