import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { languages } from "./locales/all";
import { App } from "./App";
import { LanguageContext } from "./locales/LanguageContext";

import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { UserContext, userGuest } from "./user/UserContext";

const AppWithProviders = () => {
  const [language, setLanguage] = useLocalStorage("locale", languages[0].id);
  const [user, setUser] = useLocalStorage("user", userGuest);
  const resetUser = () => setUser(userGuest);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <UserContext.Provider value={{ user, setUser, resetUser }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserContext.Provider>
    </LanguageContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);
