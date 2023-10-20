export const getPath = (path: string) => {
  const base = import.meta.env.VITE_WEB_BASE;
  if (
    (base.endsWith("/") && !path.startsWith("/")) ||
    (!base.endsWith("/") && path.startsWith("/"))
  ) {
    return `${base}${path}`;
  } else {
    return `${base}/${path}`;
  }
};
