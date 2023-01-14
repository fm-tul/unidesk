import { User_SuperAdmin } from "@api-client/constants/UserGrants";
import { GUID_EMPTY, VITE_DEBUG_LOGIN } from "@core/config";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { R, RR } from "@locales/R";
import { useContext } from "react";
import { MdAccountCircle } from "react-icons/md";
import { Link } from "react-router-dom";

import { SwitchUser } from "admin/SwitchUser";
import { link_pageMyProfile } from "routes/links";
import { Button } from "ui/Button";
import { Menu } from "ui/Menu";

import { UserContext } from "../user/UserContext";

export function UserMenu() {
  const { user, setUser, resetUser } = useContext(UserContext);
  const { language } = useContext(LanguageContext);

  const authUser = async (admin: boolean) => {
    const loginPath = admin ? "" : VITE_DEBUG_LOGIN;
    const response = loginPath
      ? await httpClient.users.loginSso({ path: loginPath })
      : await httpClient.users.login({
          requestBody: {
            password: "admin",
            eppn: "admin",
          },
        });

    if (response.isAuthenticated && response.user) {
      setUser(response.user);
    } else {
      console.log("Login failed");
    }
  };

  const logoutUser = async () => {
    const response = await httpClient.users.logout().catch(error => {
      console.log(error);
    });
    resetUser();
  };

  const testUser = async () => {
    const response = await httpClient.helloWorld.getApiHelloWorldHelloworld();
    console.log(response);
  };

  const loggedIn = user.id !== GUID_EMPTY;
  const grantsIds = user.grantIds ?? [];

  return (
    <div>
      <Menu
        className="rounded-none bg-neutral-100 p-2 shadow-lg ring-1 ring-neutral-300"
        withModal
        minWidth={256}
        link={
          <span className="flow">
            {user.fullName ?? user.username} <MdAccountCircle />
          </span>
        }
      >
        <span className="py-2 text-center text-sm font-semibold text-neutral-600">{RR("account-settings", language)}</span>
        <hr className="my-1" />

        {/* not logged in */}
        {!loggedIn && (
          <>
            <Button sm text onClick={() => authUser(true)} justify="justify-start">
              {R("login")} (admin)
            </Button>
            <Button sm text onClick={() => authUser(false)} justify="justify-start">
              {R("login")} (user)
            </Button>
          </>
        )}

        {/* logged in */}
        {loggedIn && (
          <>
            <Button component={Link} text to={link_pageMyProfile.path} justify="justify-start">
              {R("my-profile")}
            </Button>

            {grantsIds.includes(User_SuperAdmin.id) && <SwitchUser />}

            <Button text warning onClick={logoutUser} justify="justify-start">
              {R("logout")}
            </Button>
          </>
        )}
      </Menu>
    </div>
  );
}
