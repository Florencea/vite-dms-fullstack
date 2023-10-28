export const getAssetPath = (path: string) =>
  [import.meta.env.VITE_WEB_BASE, path]
    .map((p) => p.trim().replace(/(^[/]*|[/]*$)/g, ""))
    .join("/");
