import { Button, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { httpClient } from "@core/init";
import { useFetch } from "../../hooks/useFetch";
import { Translate } from "@locales/R";

export const PageUserList = () => {
  const { error, isLoading, data: users } = useFetch(() => httpClient.users.getAll({ pageSize: 100 * 2 }));

  if (error) {
    return (
      <>
        {error && (
          <span className="text-red-500">
            <Translate value="error-occurred" />: {error}
          </span>
        )}
      </>
    );
  }

  if (isLoading || !users) {
    return <>{isLoading && <span className="spinner-colors big"></span>}</>;
  }

  return (
    <>
      <div>User List</div>
      <div className="grid grid-cols-2 gap-1 md:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-1">
            <Tooltip title={user.stagId ?? ""} placement="left">
              <Button component={Link} to={`/users/${user.id}`} size="small">
                <span className="flex items-center gap-1">
                  <span className="min-w-[26px] text-right text-xs text-gray-500">{user.titleBefore}</span>
                  {user.lastName} {user.firstName}
                  {user.titleAfter && <span className="text-xs text-gray-500">{user.titleAfter}</span>}
                  {/* {user.email && <span>({user.email})</span>} */}
                </span>
              </Button>
            </Tooltip>
          </div>
        ))}
      </div>
    </>
  );
};

export default PageUserList;
