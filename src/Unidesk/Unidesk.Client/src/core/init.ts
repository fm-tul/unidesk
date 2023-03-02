import { extractErrorMessage, makeMessage } from "@core/errors";
import axios, { Axios } from "axios";
import { toast } from "react-toastify";

import { ApiClient } from "../api-client";
import { API_URL } from "./config";
import { getToastMessageOrDefault } from "./utils";

// spa reload
(axios.interceptors.response as any).handlers = [];

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// register global error
axios.interceptors.response.use(
  response => {
    const toastMsg = getToastMessageOrDefault(response.data);
    if (toastMsg) {
      toast(makeMessage(toastMsg.title, toastMsg.message), {
        type: toastMsg.type.toLowerCase() as any,
      });
    }
    return response;
  },
  error => {
    if (error?.code === "ERR_CANCELED") {
      return;
    }

    // detect 401 first
    if (error?.response?.status === 401) {
      toast.error(makeMessage(
        "Unauthorized",
        "You are not authorized to access this resource",
        () => window.location.pathname = "/login"
        ), {
        toastId: "unauthorized",
      });
    } else {
      const jsonResponse = extractErrorMessage(error?.response?.data);
      toast.error(
        makeMessage(jsonResponse?.message ?? error.message, jsonResponse?.debugMessage ?? jsonResponse?.stackTrace?.join("\n") ?? ""),
        {
          autoClose: false,
        }
      );
    }
    return Promise.reject(error?.response?.data ?? error);
  }
);

/**
 * ApiClient instance with credentials sent by default, server can recognize is user has access to some resources
 */
export const httpClient = new ApiClient({
  BASE: API_URL,
  WITH_CREDENTIALS: true,
});

/**
 * ApiClient instance which does not send credentials (by default), so all requests are anonymous and can be cached by the server
 */
export const guestHttpClient = new ApiClient({
  BASE: API_URL,
  WITH_CREDENTIALS: false,
});

export const rawAxiosClient = new Axios({
  baseURL: API_URL,
  withCredentials: true,
});

export const executeAdminAction = async (action: string, data: any = {}) => {
  return httpClient.admin.httpRequest.request({
    method: "POST",
    url: "/api/Admin/action",
    query: {
      ...data,
      action: action,
    },
  });
};
