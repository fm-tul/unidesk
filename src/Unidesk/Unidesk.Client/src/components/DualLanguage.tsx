import { Tooltip } from "@mui/material";
import { useContext } from "react";
import { LanguageContext } from "@locales/LanguageContext";

interface IDualLanguageProps {
  eng?: string | null;
  cze?: string | null;
}
export const DualLanguage = (props: IDualLanguageProps) => {
  const { eng, cze } = props;
  const { language } = useContext(LanguageContext);
  if (language === "eng") {
    return (
      <Tooltip title={cze ?? ""}>
        <span>{eng}</span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={eng ?? ""}>
      <span>{cze}</span>
    </Tooltip>
  );
};

interface IDualComponentProps {
  eng?: JSX.Element | null;
  cze?: JSX.Element | null;
}
export const DualComponent = (props: IDualComponentProps) => {
  const { eng, cze } = props;
  const { language } = useContext(LanguageContext);
  if (language === "eng" && eng) {
    return eng;
  }
  if (language === "cze" && cze) {
    return cze;
  }
  return <></>;
};
