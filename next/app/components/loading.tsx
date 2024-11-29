import usePathTranslation from "@/i18n/hook";
import { containerInner } from "../util/styles";

export const Loading = ({
  title,
  addComp,
}: {
  title?: string;
  addComp?: boolean;
}) => {
  const { t } = usePathTranslation();

  const titleComp = title ?? <h4>{title}</h4>;
  const content = (
    <>
      {titleComp}
      <p>{t("loading")}</p>
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
