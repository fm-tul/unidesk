import { UserDto } from "@api-client";
import { GUID_EMPTY } from "@core/config";
import { EnKeys } from "@locales/all";
import { R } from "@locales/R";
import { useContext } from "react";
import { Link, NavLink, Route, Routes, useMatch, useResolvedPath } from "react-router-dom";

import { Button } from "ui/Button";

import { LanguageSelector } from "./components/LanguageSelector";
import { UserMenu } from "./components/UserMenu";
import { ExtraRouteProps } from "./routes/core";
import { link_pageHome, links } from "./routes/links";
import { UserContext } from "./user/UserContext";

const renderMenu = (available_links: ExtraRouteProps[]) => {
  return (
    <div className="relative z-10 border-b border-solid border-neutral-300 bg-white/80 has-backdrop:bg-white/60 has-backdrop:backdrop-blur-md">
      <div className="container mx-auto print:hidden">
        <div className="flex items-center gap-2 p-4">
          {/* name and logo */}
          <Link to={link_pageHome.path} style={{ fontFamily: "Cairo Play" }} className="text-info-800">
            <div className="" >
              <div className="text-2xl">Témata</div>
              <div className="text-xl -mt-3">.fm.tul.cz</div>
            </div>
          </Link>

          {/* links */}
          <div className="flex gap-3">
            {available_links
              .filter(i => i.visible !== false)
              .map(i => {
                let resolved = useResolvedPath(i.path);
                let match = useMatch({ path: resolved.pathname, end: true });

                return (
                  <Button
                    text
                    key={i.path}
                    to={i.path}
                    component={NavLink}
                    className={match ? "selected" : ""}
                  >
                    {R(i.title)}
                  </Button>
                );
              })}
          </div>

          {/* push to the right */}
          <div className="ml-auto"></div>

          {/* user */}
          <UserMenu />

          {/* language selector */}
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

export const App = () => {
  const { user } = useContext(UserContext);
  const available_links = links.filter(i => hasAccess(i, user));

  // min-w-max
  return (
    <>
      <div className="root-bg fixed inset-0 -z-10"></div>

      <div className="min-h-screen">
        {renderMenu(available_links)}

        <div className="container mx-auto mt-4 grid print:max-w-[90vw]">
          {/* content */}
          <div className="rounded-md bg-white/90 p-6 shadow print:shadow-none">
            <Routes>
              {available_links.map(i => (
                <Route key={i.path} {...i} />
              ))}
            </Routes>
          </div>
        </div>
        <div className="h-[50vh]"></div>
      </div>
    </>
  );
};

export default App;

function hasAccess(i: ExtraRouteProps, user: UserDto): boolean {
  const availToAll = i.allowAnonymous === true || user.id !== GUID_EMPTY;
  if (!i.requiredGrants || i.requiredGrants.length == 0) {
    return availToAll;
  }
  const { grantIds } = user;
  return i.requiredGrants.every(grant => grantIds?.includes(grant)) && availToAll;
}
