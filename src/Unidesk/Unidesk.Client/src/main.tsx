import { IS_PROD } from "@core/config";
import { languages } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import ModalContainer from "react-modal-promise";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { App } from "./App";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { UserContext, userGuest } from "./user/UserContext";

import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";
import { defaultEnumsContext, EnumsContext } from "models/EnumsContext";
import { EnumsDto } from "./api-client";
import { httpClient } from "@core/init";
import { QueryClient, QueryClientProvider } from "react-query";
import { LanguagesId } from "@locales/common";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
const AppWithProviders = () => {
  const [language, setLanguage] = useLocalStorage<LanguagesId>("locale", languages[0].id as LanguagesId);
  const [user, setUser] = useLocalStorage("user", userGuest);
  const [enums, setEnums] = useState<EnumsDto>(defaultEnumsContext.enums);
  const resetUser = () => setUser(userGuest);

  useEffect(() => {
    const fetchEnums = async () => {
      const enums = await httpClient.enums.allEnums();
      setEnums(enums);
    };
    fetchEnums();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EnumsContext.Provider value={{ enums, setEnums }}>
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
            <ModalContainer />
          </UserContext.Provider>
        </LanguageContext.Provider>
      </EnumsContext.Provider>
    </QueryClientProvider>
  );
};

if (!IS_PROD) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
      <AppWithProviders />
    // </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(<AppWithProviders />);
}
