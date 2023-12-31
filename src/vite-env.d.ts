/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly VITE_FAVICON: string;
  readonly VITE_WEB_BASE: string;
  readonly VITE_OUTDIR: string;
  readonly VITE_API_SECURITY: string;
  readonly VITE_API_PREFIX: string;
  readonly VITE_DOC_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
