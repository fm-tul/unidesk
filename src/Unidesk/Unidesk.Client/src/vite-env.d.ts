/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DEBUG_LOGIN: string;
  readonly VITE_DEBUG_LOGIN_ADMIN: string;
  readonly VITE_DEBUG_LOGIN_STUDENT: string;
  readonly VITE_UNIDESK_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}