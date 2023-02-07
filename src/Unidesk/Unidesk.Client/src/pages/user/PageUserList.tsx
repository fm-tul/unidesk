import { LanguageContext } from "@locales/LanguageContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { UserFilterBar } from "filters/UserFilterBar";
import { link_pageUserDetail } from "routes/links";
import { Button } from "ui/Button";
import { UserLookupDto } from "@models/UserLookupDto";
import { Tooltip } from "utils/Tooltip";
import { UnideskComponent } from "components/UnideskComponent";
import { UserFunction as UserFunctionMap } from "@api-client/constants/UserFunction";
import { useDebounceLocalStorageState } from "hooks/useDebounceState";
import { UserFilter } from "@models/UserFilter";
import { UserFunction } from "@models/UserFunction";
import { distinct } from "utils/arrays";

const orderByOptions = [
  { value: "LastName", label: "lastname" },
  { value: "FirstName", label: "firstname" },
];

type UserFilterOnly = Omit<UserFilter, "filter">;
export const PageUserList = () => {
  const { language } = useContext(LanguageContext);
  const [data, setData] = useState<UserLookupDto[]>([]);

  const [filter, setFilter, debounceFilter] = useDebounceLocalStorageState<UserFilterOnly>("main.user-filter-bar", {
    keyword: "",
    userFunctions: [],
  });

  const addUseFunctionToFilter = (func: string) => {
    const userFunc = UserFunctionMap[func.trim() as keyof typeof UserFunctionMap];
    const validUserFunc = filter.userFunctions ?? [];
    if (!userFunc || validUserFunc.includes(userFunc.value as UserFunction)) {
      return;
    }
    const userFunctions = distinct([...validUserFunc, userFunc.value]) as UserFunction[];
    setFilter({ ...filter, userFunctions });
  };
  return (
    <UnideskComponent name="PageUserList">
      <LoadingWrapper isLoading={false} error={null} className="flex flex-col gap-4">
        <UserFilterBar onChange={setData} filter={filter} setFilter={setFilter} debounceFilter={debounceFilter} />

        <div className="grid grid-cols-2 content-start gap-1 md:grid-cols-3 xl:grid-cols-4">
          {data &&
            data.map(user => (
              <div key={user.id} className="flex items-center gap-1">
                <Tooltip
                  content={
                    <div className="flex flex-col">
                      <span className="flow">
                        is
                        <span className="flow text-rose-600">
                          {user.userFunction.split(",").map(i => (
                            <button onClick={() => addUseFunctionToFilter(i)} key={i}>
                              {i}
                            </button>
                          ))}
                        </span>
                      </span>
                      <span className="text-xs">
                        {user.stagId && (
                          <>
                            stagId <span className="text-rose-600">{user.stagId}</span>
                          </>
                        )}
                      </span>
                    </div>
                  }
                >
                  <Button component={Link} to={link_pageUserDetail.navigate(user.id)} sm text>
                    <span className="flex items-center gap-1">
                      <span className="min-w-[26px] text-right text-xs text-gray-500">{user.titleBefore}</span>
                      {user.fullName}
                      {user.titleAfter && <span className="text-xs text-gray-500">{user.titleAfter}</span>}
                    </span>
                  </Button>
                </Tooltip>
              </div>
            ))}
        </div>
      </LoadingWrapper>
    </UnideskComponent>
  );
};

export default PageUserList;
