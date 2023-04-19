import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { useContext } from "react";
import { classnames } from "ui/shared";
import { TulLogo } from "assets/images/tul.svg.jsx";
import { FaUserGraduate } from "react-icons/fa";
import { API_URL, VITE_DEBUG_LOGIN, VITE_DEBUG_LOGIN_ADMIN } from "@core/config";
import { Fade } from "./mui/Fade";
import { httpClient } from "@core/init";
import { useQueryClient } from "react-query";

interface LoginComponentProps {
  isLoading: boolean;
}
export const LoginComponent = (props: LoginComponentProps) => {
  const { isLoading } = props;
  const { language, setLanguage } = useContext(LanguageContext);
  const { translate } = useTranslation(language);
  const lianeLoginUrl = `${API_URL}/liane-login`;
  const queryClient = useQueryClient();

  const doDebugLogin = async (path: string) => {
    await httpClient.account.loginSso({ path });
    queryClient.invalidateQueries("whoami");
  };

  return (
    <div className="grid h-screen w-screen place-items-center">
      {/* switch language */}
      <div className="absolute top-0 right-0 m-4 flex gap-2">
        <button
          className={classnames("text-xs font-bold text-neutral-900", language === "cze" && "opacity-50")}
          onClick={() => setLanguage("eng")}
        >
          ENG
        </button>
        <button
          className={classnames("text-xs font-bold text-neutral-900", language === "eng" && "opacity-50")}
          onClick={() => setLanguage("cze")}
        >
          CZE
        </button>
      </div>

      <div className="absolute -z-10 h-screen w-screen opacity-70">
        {/* gradial white circle in the middle */}
        <div
          className="absolute h-screen w-screen"
          style={{
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255,255,255,0) 30%)",
          }}
        />
        {/* image */}
        <img
          className="h-screen w-screen object-cover"
          src="https://novy.tul.cz/wp-content/uploads/2019/09/tul-budovy-studentske-namesti.jpg"
        />
      </div>

      <div className="relative m-8 flex min-h-xs w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 ring-4 ring-white/20 has-backdrop:bg-white/50 has-backdrop:backdrop-blur-lg">
        <Fade visible={isLoading}>
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-1 bg-white/80">
            <span style={{ "--size": "100px" } as any} className="spinner-colors"></span>
            <div className="z-10 text-sm font-extrabold uppercase">{translate("login.loading")}</div>
          </div>
        </Fade>

        <div className={classnames("text-center text-2xl font-light text-neutral-700 mb-4 uppercase", isLoading && "pointer-events-none")}>
          {translate("login.title")}
        </div>
        {/* shibboleth login */}
        <div className="flex flex-col items-stretch gap-8 uppercase">
          <a
            href={isLoading ? undefined : lianeLoginUrl}
            className={classnames(
              "flex w-full items-center gap-8 rounded-sm bg-tul-500/10 p-4 text-lg transition-all",
              "hocus:rounded-xl hocus:bg-tul-500 hocus:text-white hocus:shadow-xl hocus:shadow-tul-500/50"
            )}
          >
            <TulLogo className={classnames("col-start-1 row-start-1 h-20 w-20 fill-current")} />
            <span className="col-start-1 row-start-1">{translate("login.liane")}</span>
          </a>
          <a
            href={isLoading ? undefined : lianeLoginUrl}
            className={classnames(
              "flex w-full items-center gap-8 rounded-sm bg-orange-500/10 p-4 text-lg transition-all",
              "hocus:rounded-xl hocus:bg-orange-700 hocus:text-white hocus:shadow-xl hocus:shadow-orange-500/50"
            )}
          >
            <FaUserGraduate className={classnames("col-start-1 row-start-1 h-20 w-20 fill-current")} />
            <span className="col-start-1 row-start-1">{translate("login.local-account")}</span>
          </a>

          {(!!VITE_DEBUG_LOGIN_ADMIN || !!VITE_DEBUG_LOGIN) && (
            <div className="flex gap-4">
              {!!VITE_DEBUG_LOGIN_ADMIN && (
                <button
                  className={classnames(
                    "flex w-full items-center gap-8 rounded-sm bg-rose-500/10 p-4 text-lg transition-all" ,
                    "hocus:rounded-xl hocus:bg-rose-700 hocus:text-white hocus:shadow-xl hocus:shadow-rose-500/50"
                  )}
                  onClick={() => doDebugLogin(VITE_DEBUG_LOGIN_ADMIN)}
                >
                  Login Admin
                </button>
              )}
              {!!VITE_DEBUG_LOGIN && (
                <button
                  className={classnames(
                    "flex w-full items-center gap-8 rounded-sm bg-violet-500/10 p-4 text-lg transition-all",
                    "hocus:rounded-xl hocus:bg-violet-700 hocus:text-white hocus:shadow-xl hocus:shadow-violet-500/50"
                  )}
                  onClick={() => doDebugLogin(VITE_DEBUG_LOGIN)}
                >
                  Login Debug
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
