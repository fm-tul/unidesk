/// <reference types="vite/client" />

const env = import.meta.env;
export const API_URL = ""//env.VITE_API_URL ? (env.VITE_API_URL as string) : "";
export const VITE_DEBUG_LOGIN = env.VITE_DEBUG_LOGIN ? (env.VITE_DEBUG_LOGIN as string) : "";
export const VITE_DEBUG_LOGIN_ADMIN = env.VITE_DEBUG_LOGIN_ADMIN ? (env.VITE_DEBUG_LOGIN_ADMIN as string) : "";
export const IS_PROD = env.PROD === true;
export const IS_DEV = env.DEV === true;
export const GUID_EMPTY = "00000000-0000-0000-0000-000000000000";
export const VITE_UNIDESK_VERSION = env.VITE_UNIDESK_VERSION ? (env.VITE_UNIDESK_VERSION as string) : "0.0.0";
