import { All } from "@api-client/constants/ThesisStatus";
import { LanguagesId } from "@locales/all";
import { ThesisStatus } from "@models/ThesisStatus";

export const renderThesisStatus = (status: ThesisStatus, locale: LanguagesId) => {
    const item = All.find(i => i.value === status);
    return item?.[locale] ?? status;
}