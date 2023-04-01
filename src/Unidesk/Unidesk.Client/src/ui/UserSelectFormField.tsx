import { httpClient } from "@core/init";
import { UserLookupDto } from "@models/UserLookupDto";
import { extractPagedResponse } from "hooks/useFetch";
import { renderUserLookup } from "models/cellRenderers/UserRenderer";
import { FormField } from "./FormField";
import { SelectFieldLive, SelectFieldProps } from "./SelectField";

interface UserSelectFormFieldProps extends Omit<SelectFieldProps<UserLookupDto>, "options"> {
  value: UserLookupDto | UserLookupDto[] | undefined;
  onValue: (v: UserLookupDto[]) => void;
}

export const UserSelectFormField = (props: UserSelectFormFieldProps) => {
  const { value, onValue, ...rest } = props;

  return (
    <FormField
      {...rest}
      as={SelectFieldLive<UserLookupDto>}
      value={value}
      searchable
      clearable
      options={keyword => extractPagedResponse(httpClient.users.find({ requestBody: { keyword, paging: { page: 1, pageSize: 10 } } }))}
      getTitle={i => renderUserLookup(i, true)}
      getValue={i => i.fullName}
      onValue={onValue}
    />
  );
};
