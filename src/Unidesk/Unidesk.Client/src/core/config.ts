/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
}

const env = import.meta.env as unknown as ImportMetaEnv;

export const API_URL = env.VITE_API_URL
    ? env.VITE_API_URL as string
    : "";