import { LanguageContext } from "@locales/LanguageContext";
import { UserDto } from "@models/UserDto";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { UserFilterBar } from "filters/UserFilterBar";
import { link_pageUserDetail } from "routes/links";
import { Button } from "ui/Button";

export const PageUserList = () => {
  const { language } = useContext(LanguageContext);
  const [data, setData] = useState<UserDto[]>([]);

  return (
    <>
      <LoadingWrapper isLoading={false} error={null} className="flex flex-col gap-4">
        <UserFilterBar onChange={setData} />

        <div className="grid grid-cols-2 content-start gap-1 md:grid-cols-3 xl:grid-cols-4">
          {data &&
            data.map(user => (
              <div key={user.id} className="flex items-center gap-1">
                {/* <Tooltip title={user.stagId ?? ""} placement="left"> */}
                <Button component={Link} to={link_pageUserDetail.navigate(user.id)} sm text title={user.stagId ?? ""}>
                  <span className="flex items-center gap-1">
                    <span className="min-w-[26px] text-right text-xs text-gray-500">{user.titleBefore}</span>
                    {user.lastName} {user.firstName}
                    {user.titleAfter && <span className="text-xs text-gray-500">{user.titleAfter}</span>}
                    {user.thesisCount != null && user.thesisCount > 1 && <span className="text-xs text-gray-500">({user.thesisCount}×)</span>}
                  </span>
                </Button>
                {/* </Tooltip> */}
              </div>
            ))}
        </div>
      </LoadingWrapper>
    </>
  );
};

export default PageUserList;
