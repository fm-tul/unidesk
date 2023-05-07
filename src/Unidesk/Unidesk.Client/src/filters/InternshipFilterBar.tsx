import { InternshipStatusAll } from "@api-client/constants/InternshipStatus";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { InternshipFilter } from "@models/InternshipFilter";
import { InternshipStatus } from "@models/InternshipStatus";
import { FilterBar } from "components/FilterBar";
import { PagingModel } from "hooks/usePaging";
import { EnumsContext } from "models/EnumsContext";
import { useContext } from "react";
import { FormField } from "ui/FormField";
import { SelectField } from "ui/SelectField";

export interface InternshipFilterBarProps {
  filterModel: [InternshipFilter, React.Dispatch<React.SetStateAction<InternshipFilter>>];
  pageModel: PagingModel;
}
export const InternshipFilterBar = (props: InternshipFilterBarProps) => {
  const { filterModel, pageModel } = props;
  const [filter, setFilter] = filterModel;
  const {language} = useContext(LanguageContext);
  const { translateVal, translate } = useTranslation(language);
  const { enums } = useContext(EnumsContext);

  return (
    <FilterBar>
      <FormField
        as={SelectField<string|undefined>}
        size="sm"
        label={translate("school-year")}
        options={enums.schoolYears.map(i => i.id)}
        value={filter.schoolYearId ?? undefined}
        onValue={i => setFilter({ ...filter, schoolYearId: i[0] })}
        getTitle={i => enums.schoolYears.find(j => j.id === i)?.name}
        clearable
        searchable
      />

      <FormField
        as={SelectField<InternshipStatus>}
        size="sm"
        label={translate("status")}
        options={Object.values(InternshipStatus)}
        value={filter.status}
        getTitle={i => translateVal(InternshipStatusAll.find(j => j.value === i))}
        onValue={i => setFilter({ ...filter, status: i[0] })}
        clearable
        searchable
      />
    </FilterBar>
  );
};

export default InternshipFilterBar;
