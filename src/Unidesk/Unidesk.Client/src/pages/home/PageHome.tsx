import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { Debug } from "components/Debug";
import { UnideskComponent } from "components/UnideskComponent";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { link_pageInternshipDetail, link_pageThesisDetail, link_pageThesisList } from "routes/links";
import { classnames } from "ui/shared";
import { UserContext } from "user/UserContext";

export const PageHome = () => {
  const { user: me } = useContext(UserContext);
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);
  
  return (
    <UnideskComponent name="PageHome" className="">
      <h1 className="text-1xl font-extralight">{translate("home.welcome-to-temata", me.firstName ?? me.fullName)}</h1>
      <div className="mt-4 flex flex-col gap-8 sm:flex-row">
        {/* <Link to={link_pageThesisList.path}
          className={classnames(
            "grow rounded-sm p-12 text-lg transition-all text-center group",
            "bg-tul-500/10 shadow-tul-500/50",
            "hocus:bg-tul-500 hocus:text-white hocus:shadow-xl hocus:text-2xl"
          )}
        >
          {translate("home.i-am-looking-for-thesis")}
        </Link>
        <Link to={link_pageThesisDetail.navigate("new")}
          className={classnames(
            "grow rounded-sm p-12 text-lg transition-all text-center group",
            "bg-sky-500/10 shadow-sky-600/50",
            "hocus:bg-sky-600 hocus:text-white hocus:shadow-xl hocus:text-2xl"
          )}
      >     
          {translate("home.i-want-to-create-thesis")}
        </Link> */}

        
        <Link to={link_pageInternshipDetail.navigate("new")}
          className={classnames(
            "grow rounded-sm p-12 text-lg transition-all text-center group",
            "bg-sky-500/10 shadow-sky-600/50",
            "hocus:bg-sky-600 hocus:text-white hocus:shadow-xl hocus:text-2xl"
          )}
      >     
          {translate("home.i-want-to-register-internship")}
        </Link>
      </div>
      <Debug value={me} />
    </UnideskComponent>
  );
};
export default PageHome;
