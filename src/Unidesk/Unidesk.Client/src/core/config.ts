/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

export const API_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL as string
    : "";