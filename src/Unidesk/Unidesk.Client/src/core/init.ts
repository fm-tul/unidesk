import { ApiClient } from "../api-client";
import { API_URL } from "./config";

export const httpClient = new ApiClient({
  BASE: API_URL,
  WITH_CREDENTIALS: true,
});
