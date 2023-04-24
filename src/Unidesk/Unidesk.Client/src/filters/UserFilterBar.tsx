import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { QueryPaging } from "@models/QueryPaging";
import { UserFilter } from "@models/UserFilter";
import { UserFunction } from "@models/UserFunction";
import { useContext } from "react";
import { MdClear } from "react-icons/md";

import { FilterBar } from "components/FilterBar";
import { Paging } from "components/Paging";
import { usePagedQuery } from "hooks/useFetch";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { generatePrimitive, Select } from "ui/Select";
import { TextField } from "ui/TextField";
import { UserLookupDto } from "@models/UserLookupDto";
import { SelectField } from "ui/SelectField";
import { No as OptionNo, Yes as OptionYes } from "@api-client/constants/YesNo";
import { usePaging } from "hooks/usePaging";

const userFunctionOptions = generatePrimitive(Object.values(UserFunction));
type UserFilterOnly = Omit<UserFilter, "filter">;
interface UserFilterBarProps {
  onChange?(data: UserLookupDto[]): void;
  filter: UserFilterOnly;
  setFilter: (value: UserFilterOnly) => void;
  debounceFilter: UserFilterOnly;
}
export const UserFilterBar = (props: UserFilterBarProps) => {
  const { onChange, filter, setFilter, debounceFilter } = props;
  const { language } = useContext(LanguageContext);
  const translate = (value: EnKeys) => RR(value, language);

  const pageModel = usePaging({ pageSize: 20 });
  const { paging, setPaging } = pageModel;
  const { isLoading, refresh } = usePagedQuery({
    queryFn: i => httpClient.users.find(i),
    queryKey: ["thesis", "find", debounceFilter],
    pageModel,
    filter,
    onChange,
  });

  const updatePagination = (filter: QueryPaging) => {
    setPaging({ ...filter });
    refresh();
  };

  const orderByOptions = [
    { value: "LastName", label: "lastname" },
    { value: "FirstName", label: "firstname" },
    { value: "Modified", label: "modified" },
    { value: "Created", label: "created" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <FilterBar disabled={isLoading}>
        <FormField
          as={TextField}
          loading={isLoading}
          fullWidth={false}
          classNameField="grow"
          value={filter.keyword}
          onValue={(v: string) => setFilter({ ...filter, keyword: v })}
          label={translate("search")}
          onEnter={refresh}
        />

        <FormField
          as={Select<UserFunction>}
          options={userFunctionOptions}
          value={filter.userFunctions!}
          classNameField="min-w-xs max-w-sm"
          onMultiValue={(uf: UserFunction[]) => setFilter({ ...filter, userFunctions: uf })}
          placeholder={translate("user-function")}
          clearable
          multiple
          searchable
        />

        <FormField
          as={SelectField<boolean>}
          label={translate("linked-with-stag")}
          options={[true, false]}
          value={filter.linkedWithStag as boolean | undefined}
          onValue={(v: boolean[]) => setFilter({ ...filter, linkedWithStag: v[0] })}
          getTitle={(i: boolean) => (i ? OptionYes[language] : OptionNo[language])}
          width="w-full min-w-[200px]"
          clearable
        />

        <Paging className="ml-auto" paging={paging} onValue={updatePagination} />

        <FilterBar type="btn-group">
          <Button onClick={refresh}>{translate("search")}</Button>

          <Button size="sm" color="warning" variant="contained" onClick={() => setFilter({ keyword: "", userFunctions: [] })}>
            <MdClear />
          </Button>
        </FilterBar>
      </FilterBar>
      <div>
        <FormField
          as={SelectField<string>}
          size="sm"
          label={translate("sort-by")}
          options={orderByOptions.map(o => o.value)}
          value={paging.orderBy as string}
          onValue={(v: string[]) => updatePagination({ ...paging, orderBy: v[0] })}
          getTitle={(i: string) => translate(orderByOptions.find(o => o.value === i)!.label as EnKeys)}
          width="w-full min-w-[200px]"
          clearable
        />
      </div>
    </div>
  );
};
