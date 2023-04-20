import { useContext, useState } from "react";
import { Collapse } from "./mui/Collapse";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { classnames } from "ui/shared";
import { Button } from "ui/Button";
import { httpClient } from "@core/init";
import { UserContext } from "user/UserContext";
import { toast } from "react-toastify";

export interface LoginFormProps {
  open: boolean;
}
export const LoginForm = (props: LoginFormProps) => {
  const { open } = props;
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);
  const [eppn, setEppn] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const { user: me, setUser } = useContext(UserContext);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const inputClassNames = classnames(
    "rounded p-2 outline-none w-full",
    "hover:ring-2 hover:ring-orange-300 hover:bg-orange-50",
    "focus:ring-2 focus:ring-orange-500 focus:bg-white"
  );

  const doLogin = async () => {
    const passwordBase64 = btoa(password);
    const response = await httpClient.account
      .login({
        requestBody: {
          eppn,
          passwordBase64,
          recoveryToken: resetToken,
        },
      })
      .catch(() => {
        setInvalidCredentials(true);
      });

    if (response) {
      setUser(response.data);
    }
  };

  const doResetPassword = async () => {
    httpClient.account
      .resetPassword({
        requestBody: {
          eppn,
        },
      })
      .then(() => {
        toast.success(translate("login.reset-password-sent"));
        setResetSent(true);
      });
  };

  return (
    <div className="my-4 normal-case">
      <Collapse open={open} className="mx-20 rounded-lg bg-orange-500/20 p-8" width="w-auto">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold">{translate("login.username")}</label>
            <input
              type="email"
              name="email"
              required
              value={eppn}
              className={inputClassNames}
              onChange={e => setEppn(e.target.value)}
              placeholder={translate("login.username.placeholder") as string}
            />
          </div>

          <div>
            <label className="block text-sm font-bold">{translate(resetSent ? "login.password-new" : "login.password")}</label>
            <input
              type="password"
              name="password"
              required
              value={password}
              className={inputClassNames}
              onChange={e => setPassword(e.target.value)}
              placeholder={translate("login.password.placeholder") as string}
            />
          </div>

          {resetSent && (
            <>
              <div>
                <label className="block text-sm font-bold">{translate(resetSent ? "login.password-new-repeat" : "login.password")}</label>
                <input
                  type="password"
                  name="password"
                  required
                  className={inputClassNames}
                  value={passwordRepeat}
                  onChange={e => setPasswordRepeat(e.target.value)}
                  placeholder={translate("login.password.placeholder") as string}
                />
              </div>

              <div>
                <label className="block text-sm font-bold">{translate("login.reset-token")}</label>
                <input
                  type="password"
                  name="resetToken"
                  required
                  className={inputClassNames}
                  onChange={e => setResetToken(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex justify-between">
            <Button color="warning" disabled text if={!resetSent}>
              {translate("login.register")}
            </Button>
            <div className="flex flex-col gap-1">
              <Button color="warning" onClick={doLogin} disabled={resetSent && password !== passwordRepeat}>
                {translate(resetSent ? "login.change-password" : "login.login")}
              </Button>
              <Button
                text
                error
                sm
                onConfirmedClick={doResetPassword}
                if={invalidCredentials && !resetSent}
                confirmDialogOptions={{
                  title: "login.reset-password",
                  message: "login.do-you-really-wish-to-reset-password",
                }}
              >
                {translate("login.reset-password")}
              </Button>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default LoginForm;
