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
import { FloatingAction } from "components/mui/FloatingAction";
import { TranslateFunc, useTranslation } from "@locales/translationHooks";
import { UserContext } from "user/UserContext";
import { Grants } from "@api-client/constants/Grants";
import { RegisterRequest } from "@api-client/index";
import { Modal } from "ui/Modal";
import { TextField } from "ui/TextField";
import { ButtonGroup } from "components/FilterBar";
import { httpClient } from "@core/init";
import { mapComplex } from "utils/stringUtils";

interface UserRoleRendererProps {
  user: UserLookupDto;
  translate: TranslateFunc;
  onRoleClick?: (role: string) => void;
}
const UserFunctionRenderer = (props: UserRoleRendererProps) => {
  const { user, onRoleClick, translate } = props;

  const functions = user.userFunction.split(",");
  const and = translate("and") as string;
  const isNone = functions.length === 1 && functions[0] === UserFunction.NONE;

  return (
    <div className="flex flex-col">
      <span className="flow">
        {isNone ? (
          translate("user.function.no-functions")
        ) : (
          <>
            {translate("user.function.is")}
            <span className="flow text-rose-600">
              {mapComplex(functions, and, ", ", (i, sep, index) => {
                return !!sep ? (
                  <span className="text-black" key={index}>
                    {sep}
                  </span>
                ) : (
                  <button onClick={() => onRoleClick?.(i!)} key={i}>
                    {i}
                  </button>
                );
              })}
            </span>
          </>
        )}
      </span>
      <span className="text-xs">
        {user.stagId && (
          <>
            stagId <span className="text-rose-600">{user.stagId}</span>
          </>
        )}
      </span>
    </div>
  );
};

type UserFilterOnly = Omit<UserFilter, "filter">;
export const PageUserList = () => {
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);
  const { user: me } = useContext(UserContext);
  const [newUser, setNewUser] = useState<RegisterRequest | null>(null);

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

  const createNewUser = async () => {
    if (!newUser) {
      return;
    }
    await httpClient.account.register({ requestBody: newUser });
  };

  return (
    <UnideskComponent name="PageUserList">
      <LoadingWrapper isLoading={false} error={null} className="flex flex-col gap-4">
        <UserFilterBar onChange={setData} filter={filter} setFilter={setFilter} debounceFilter={debounceFilter} />

        <div className="grid grid-cols-2 content-start gap-1 md:grid-cols-3 xl:grid-cols-4">
          {data &&
            data.map(user => (
              <div key={user.id} className="flex items-center gap-1">
                <Tooltip content={<UserFunctionRenderer user={user} onRoleClick={addUseFunctionToFilter} translate={translate} />}>
                  <Button component={Link} to={link_pageUserDetail.navigate(user.id)} sm text>
                    <span className="flex items-center gap-1">
                      <span className="min-w-[26px] text-right text-xs text-gray-500 normal-case">{user.titleBefore}</span>
                      {user.fullName}
                      {user.titleAfter && <span className="text-xs text-gray-500 normal-case">{user.titleAfter}</span>}
                    </span>
                  </Button>
                </Tooltip>
              </div>
            ))}
        </div>
        {me.grantIds.includes(Grants.Action_Create_User.id) && (
          <FloatingAction tooltip={translate("create")} onClick={() => setNewUser({})} />
        )}
        {newUser && (
          <Modal open={true} onClose={() => setNewUser(null)} width="md" className="rounded bg-white p-4">
            <h1 className="text-2xl font-bold">{translate("user.create-new-user")}</h1>
            <TextField
              label="Email"
              type="email"
              className=" my-4"
              value={newUser.eppn}
              onChange={e => setNewUser({ ...newUser, eppn: e.target.value })}
            />
            <ButtonGroup className="justify-end" variant="text">
              <Button onClick={() => setNewUser(null)} warning>
                {translate("cancel")}
              </Button>
              <Button onClick={createNewUser}>{translate("create")}</Button>
            </ButtonGroup>
          </Modal>
        )}
      </LoadingWrapper>
    </UnideskComponent>
  );
};

export default PageUserList;
