import { extractErrorMessage, makeMessage } from "@core/errors";
import axios from "axios";
import { toast } from "react-toastify";

import { ApiClient } from "../api-client";
import { API_URL } from "./config";

// spa reload
(axios.interceptors.response as any).handlers = [];

axios.interceptors.response.use(
  response => response,
  error => {
    const jsonResponse = extractErrorMessage(error?.response?.data);
    toast.error(makeMessage(
      jsonResponse?.message ?? error.message,
      jsonResponse?.debugMessage ?? jsonResponse?.stackTrace?.join("\n") ?? ""
    ), {
      autoClose: false,
    });
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
