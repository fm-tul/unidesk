import { GUID_EMPTY, IS_PROD, VITE_UNIDESK_VERSION } from "@core/config";
import { languages } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import ModalContainer from "react-modal-promise";
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
import { axiosOptions, httpClient } from "@core/init";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { LanguagesId } from "@locales/common";
import { LoginComponent } from "components/LoginComponent";
import { BrowserRouter } from "react-router-dom";
import EnvTag from "components/EnvTag";
import { setLocale } from "@core/momentProvider";

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
  const activeLanguage = languages.find(l => l.id === language)!;
  setLocale(activeLanguage.locale as string);

  const [user, setUser] = useLocalStorage("user", userGuest);
  const [enums, setEnums] = useState<EnumsDto>(defaultEnumsContext.enums);
  const resetUser = () => setUser(userGuest);
  const isLoggedIn = !!user && user.id != GUID_EMPTY;

  // path does not start with /evaluation/...
  const location = window.location.pathname;
  const requireLogin = !location.startsWith("/evaluation/");
  const environment = user.environment;

  const logginingQuery = useQuery({
    queryKey: "whoami",
    queryFn: () => {
      axiosOptions.interceptors = false;
      return httpClient.account.whoAmI();
    },
    onSuccess: response => {
      axiosOptions.interceptors = true;
      setUser(response.data);
    },
    onError: () => {
      axiosOptions.interceptors = true;
      setUser(userGuest);
    },
  });


  useQuery({
    queryKey: "enums",
    queryFn: () => httpClient.enums.allEnums(),
    enabled: isLoggedIn,
    onSuccess: data => {
      setEnums(data);
    },
  });

  return (
    <EnumsContext.Provider value={{ enums, setEnums }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <UserContext.Provider value={{ user, setUser, resetUser }}>
          <BrowserRouter>
            <>
              {isLoggedIn || !requireLogin ? <App /> : <LoginComponent isLoading={logginingQuery.isLoading || logginingQuery.isFetching} />}
              {/* {<App /> } */}
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
              <EnvTag environment={environment} visible={user.fullName === "admin"} />
              <div className="fixed bottom-0 right-0 text-xs text-neutral-500 select-none hover:text-black">v{VITE_UNIDESK_VERSION}</div>
            </>
          </BrowserRouter>
          <ModalContainer />
        </UserContext.Provider>
      </LanguageContext.Provider>
    </EnumsContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppWithProviders />
    </QueryClientProvider>
  </React.StrictMode>
);
