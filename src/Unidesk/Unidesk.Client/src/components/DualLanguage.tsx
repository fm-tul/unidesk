import { LanguagesId } from "@locales/all";

interface IDualLanguageProps {
  eng?: string | null;
  cze?: string | null;
  language?: LanguagesId;
}
export const DualLanguage = (props: IDualLanguageProps) => {
  const { eng, cze, language } = props;
  return <span>{language === "cze" ? cze : eng}</span>;
};
