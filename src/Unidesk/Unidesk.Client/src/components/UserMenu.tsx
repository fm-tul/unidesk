import { useContext } from "react";
import { R } from "../locales/R";
import { Button } from "@mui/material";
import { UserContext } from "../user/UserContext";
import { httpClient } from "../core/init";

export function UserMenu() {
  const { user, setUser, resetUser } = useContext(UserContext);

  const authUser = async () => {
    const response = await httpClient.users.login({
      requestBody: {
        password: "admin",
        username: "admin",
      },
    });

    if (response.isAuthenticated && response.user) {
      setUser(response.user);
    } else {
      console.log("Login failed");
    }
  };

  const logoutUser = async () => {
    const response = await httpClient.users.logout().catch((error) => {
      console.log(error);
    });
    resetUser();
  };

  const testUser = async () => {
    const response = await httpClient.helloWorld.getApiHelloWorldHelloworld();
    console.log(response);
  };

  return (
    <div>
      {user.username}

      {/* not logged in */}
      {user.grants.length == 0 && <Button onClick={authUser}>{R("login")}</Button>}

      {/* logged in */}
      {user.grants.length > 0 && <Button onClick={logoutUser}>{R("logout")}</Button>}
    </div>
  );
}
