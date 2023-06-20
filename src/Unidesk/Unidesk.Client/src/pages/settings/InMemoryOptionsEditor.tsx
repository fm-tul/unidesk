import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { R } from "@locales/R";
import { useTranslation } from "@locales/translationHooks";
import { InMemoryOptions } from "@models/InMemoryOptions";
import { ButtonGroup } from "components/FilterBar";
import { useContext, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { toast } from "react-toastify";
import { Button } from "ui/Button";

export const InMemoryOptionsEditor = () => {
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);
  const [dto, setDto] = useState<InMemoryOptions | undefined>(undefined);

  const getQUery = useQuery({
    queryKey: "inMemoryOptions",
    queryFn: () => httpClient.settings.getInMemoryOptions(),
    onSuccess: setDto,
  });

  const setQuery = useMutation((dto: InMemoryOptions) => httpClient.settings.setInMemoryOptions({ requestBody: dto! }), {
    onSuccess: data => {
        setDto(data);
        toast.success(translate("saved"));
    },
  });

  return (
    <div className="m-4 grid place-items-center">
      <div className="grid min-w-sm grid-cols-2 gap-2 p-4">
        {!getQUery.isLoading && !getQUery.isFetching && (
          <>
            <div>Disable Emails: </div>
            <input type="checkbox" checked={dto?.disableEmails} onChange={e => setDto({ ...dto!, disableEmails: e.target.checked })} />
          </>
        )}
        <ButtonGroup className="col-span-2 flex w-full justify-end" variant="text" size="sm">
          <Button warning>{R("close")}</Button>
          <Button onClick={() => setQuery.mutate(dto!)}>{translate("update")}</Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
