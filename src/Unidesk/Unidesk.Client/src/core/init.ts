import { ApiClient } from "../api-client";
import { API_URL } from "./config";

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
