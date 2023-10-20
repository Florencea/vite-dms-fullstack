import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function NotFound() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (
      pathname !== import.meta.env.VITE_WEB_BASE &&
      pathname !== `${import.meta.env.VITE_WEB_BASE}/`
    ) {
      window.location.replace(import.meta.env.VITE_WEB_BASE);
    }
  }, [pathname]);
  return null;
}
