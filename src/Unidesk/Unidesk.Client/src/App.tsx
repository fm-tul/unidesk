import { UserDto } from "@api-client";
import { GUID_EMPTY } from "@core/config";
import { R } from "@locales/R";
import { useContext } from "react";
import { Link, NavLink, Route, Routes, useMatch, useResolvedPath } from "react-router-dom";

import { Button } from "ui/Button";

import { LanguageSelector } from "./components/LanguageSelector";
import { UserMenu } from "./components/UserMenu";
import { ExtraRouteProps } from "./routes/core";
import { link_pageHome, links } from "./routes/links";
import { UserContext } from "./user/UserContext";
import { setTitleDetails } from "models/PageTitleControl";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { EnKeys } from "@locales/all";
import { classnames } from "ui/shared";

const renderMenu = (available_links: ExtraRouteProps[]) => {
  return (
    <div className="relative z-10 border-b border-solid border-neutral-300 bg-white/80 has-backdrop:bg-white/60 has-backdrop:backdrop-blur-md">
      <div className="container mx-auto print:hidden">
        <div className="flex items-center gap-2 p-4">
          {/* name and logo */}
          <Link to={link_pageHome.path} style={{ fontFamily: "Cairo Play" }} className="text-info-800">
            <div className="">
              <div className="text-2xl">Témata</div>
              <div className="-mt-3 text-xl">.fm.tul.cz</div>
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
                  <Button text key={i.path} to={i.path} component={NavLink} className={match ? "selected" : ""}>
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
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);

  const activeLinks = available_links.filter(i => useMatch({ path: useResolvedPath(i.path).pathname, end: true }));
  if (activeLinks.length == 1) {
    setTitleDetails(translate(activeLinks[0].title as EnKeys) as string);
  }
  // detect route change
  // const location = useLocation();
  // useEffect(() => {
  //   console.log(useRouteMatch(location.pathname));
  //   // useResolvedPath(available_links[0].path)
  //     // const activeLink = available_links.find(i => useMatch({ path: useResolvedPath(i.path).pathname, end: true }));
  //     // console.log("activeLink", activeLink);
  //     // let resolved = useResolvedPath(i.path);
  //     // let match = useMatch({ path: resolved.pathname, end: true });
  // }, [location.pathname]);

  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  const outerWidth = window.outerWidth;
  const outerHeight = window.outerHeight;

  // min-w-max
  return (
    <>
      <div className="root-bg fixed inset-0 -z-10"></div>

      <div className="min-h-screen">
        {renderMenu(available_links)}

        <div
          id="app-content"
          className={classnames(
            "app-center mx-4 mt-4 rounded-md bg-white/90 p-6 shadow",
            "w-full max-w-[100%]",
            "md:max-w-md",
            "lg:max-w-lg",
            "xl:max-w-xl",
            "print:shadow-none"
          )}
        >
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

      <div>
        {innerWidth}x{innerHeight}
        <br />
        {outerWidth}x{outerHeight}
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
