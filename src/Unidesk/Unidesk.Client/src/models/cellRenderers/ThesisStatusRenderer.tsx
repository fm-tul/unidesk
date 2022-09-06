import { ThesisStatus } from "@models/ThesisStatus";

export const renderThesisStatus = (item: ThesisStatus) => {
    const value = (item?.toString() ?? "").replaceAll("_", " ");
    return <span>{value}</span>;
}