import { Link, Route, Routes } from "react-router-dom";
import { ExtraRouteProps, links, link_pageHome } from "./config/links";
import { EnKeys } from "@locales/all";
import { LanguageSelector } from "./components/LanguageSelector";
import { UserMenu } from "./components/UserMenu";
import { R } from "@locales/R";
import { Button } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "./user/UserContext";
import { UserDto } from "@api-client";

export const App = () => {
  const { user } = useContext(UserContext);
  const available_links = links.filter((i) => has_access(i, user));

  // min-w-max
  return (
    <div className="container mx-auto grid bg-orange-100">
      {/* menu */}
      <div className="flex items-center gap-2 p-4">
        {/* name and logo */}
        <Link to={link_pageHome.path}>
          <div className="font-mono">Unidesk</div>
        </Link>

        {/* links */}
        <div className="flex gap-3">
          {available_links
            .filter((i) => i.visible !== false)
            .map((link) => (
              <Link key={link.path} to={link.path}>
                <Button>{R(link.title as EnKeys)}</Button>
              </Link>
            ))}
        </div>

        {/* push to the right */}
        <div className="ml-auto"></div>

        {/* user */}
        <UserMenu />

        {/* language selector */}
        <LanguageSelector />
      </div>

      {/* content */}
      <div className="rounded-sm bg-slate-100 p-4 shadow">
        <Routes>
          {available_links.map((i) => (
            <Route key={i.path} {...i} />
          ))}
        </Routes>
      </div>
    </div>
  );
};

export default App;

function has_access(i: ExtraRouteProps, user: UserDto): boolean {
  if (!i.requiredGrants || i.requiredGrants.length == 0) {
    return true;
  }
  const { grants } = user;
  const has_access = i.requiredGrants.every((grant) => grants.includes(grant));
  return has_access;
}
