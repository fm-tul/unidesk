import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { useContext } from "react";

interface SectionProps {
    title: EnKeys
}

export const Section = ({ title }: SectionProps) => {
    const {language} = useContext(LanguageContext);
    const { translate } = useTranslation(language);

    return (
        <div className="form-section">
            {translate(title)}
        </div>
    )
}