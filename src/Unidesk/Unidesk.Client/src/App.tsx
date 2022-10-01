import { UserDto } from "@api-client";
import { EnKeys } from "@locales/all";
import { R } from "@locales/R";
import { useContext } from "react";
import { Link, Route, Routes } from "react-router-dom";

import { Button } from "ui/Button";

import { LanguageSelector } from "./components/LanguageSelector";
import { UserMenu } from "./components/UserMenu";
import { ExtraRouteProps } from "./routes/core";
import { link_pageHome, links } from "./routes/links";
import { UserContext } from "./user/UserContext";

const renderMenu = (available_links: ExtraRouteProps[]) => {
  return (
    <div className="bg-white/80 border-b border-solid border-neutral-300 has-backdrop:bg-white/60 has-backdrop:backdrop-blur-md relative z-10">
      <div className="container mx-auto print:hidden">
        <div className="flex items-center gap-2 p-4">
          {/* name and logo */}
          <Link to={link_pageHome.path}>
            <div className="font-mono">Unidesk</div>
          </Link>

          {/* links */}
          <div className="flex gap-3">
            {available_links
              .filter(i => i.visible !== false)
              .map(i => (
                <Button text key={i.path} to={i.path} component={Link}>
                  {R(i.title as EnKeys)}
                </Button>
              ))}
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
  const available_links = links.filter(i => has_access(i, user));

  // min-w-max
  return (
    <>
      <div
        className="fixed inset-0 -z-10 root-bg"
      ></div>

      <div className="min-h-screen bg-neutral-200/50">
        {renderMenu(available_links)}

        <div className="container mx-auto grid bg-white/80 print:max-w-[90vw]">
          {/* content */}
          <div className="rounded-sm p-4 shadow print:shadow-none">
            <Routes>
              {available_links.map(i => (
                <Route key={i.path} {...i} />
              ))}
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

function has_access(i: ExtraRouteProps, user: UserDto): boolean {
  if (!i.requiredGrants || i.requiredGrants.length == 0) {
    return true;
  }
  const { grantIds } = user;
  const has_access = i.requiredGrants.every(grant => grantIds?.includes(grant));
  return has_access;
}
