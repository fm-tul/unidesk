import { Tooltip } from "@mui/material";
import { useContext } from "react";
import { LanguageContext } from "../locales/LanguageContext";

interface IDualLanguageProps {
  eng: string;
  cze: string;
}
export const DualLanguage = (props: IDualLanguageProps) => {
  const { eng, cze } = props;
  const { language } = useContext(LanguageContext);
  if (language === "eng") {
    return (
      <Tooltip title={cze}>
        <span>{eng}</span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={eng}>
      <span>{cze}</span>
    </Tooltip>
  );
};
