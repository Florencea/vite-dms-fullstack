import { routes } from "@generouted/react-router";
import { createRoot } from "react-dom/client";
import { Providers } from "./providers";

const container = document.getElementById(
  import.meta.env.VITE_REACT_ROOT_ID,
) as HTMLDivElement;

createRoot(container).render(
  <Providers container={container}>{routes}</Providers>,
);
