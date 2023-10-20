/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly VITE_FAVICON: string;
  readonly VITE_REACT_ROOT_ID: string;
  readonly VITE_WEB_BASE: string;
  readonly VITE_API_PREFIX: string;
  readonly VITE_THEME_PRIMARY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
