import { languages, LanguagesId } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { UserContext, userGuest } from "./user/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IS_PROD } from "@core/config";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

const AppWithProviders = () => {
  const [language, setLanguage] = useLocalStorage<LanguagesId>("locale", languages[0].id as LanguagesId);
  const [user, setUser] = useLocalStorage("user", userGuest);
  const resetUser = () => setUser(userGuest);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <UserContext.Provider value={{ user, setUser, resetUser }}>
        <BrowserRouter>
          <App />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
          />
        </BrowserRouter>
      </UserContext.Provider>
    </LanguageContext.Provider>
  );
};

if (IS_PROD) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppWithProviders />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(<AppWithProviders />);
}
