import { EnumsDto } from "@models/EnumsDto";
import { createContext } from "react";

export interface IEnumsContext {
  enums: EnumsDto;
  setEnums: (enums: EnumsDto) => void;
}

export const defaultEnumsContext: IEnumsContext = {
  enums: {
    departments: [],
    faculties: [],
    schoolYears: [],
    studyProgrammes: [],
    thesisOutcomes: [],
    thesisTypes: [],
    roles: [],
  },
  setEnums: () => {},
};

export const EnumsContext = createContext<IEnumsContext>(defaultEnumsContext);
