import generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react-swc";
import { cwd } from "node:process";
import { defineConfig, loadEnv } from "vite";

const { VITE_WEB_BASE } = loadEnv("development", cwd(), "");

export default defineConfig({
  base: VITE_WEB_BASE,
  build: {
    chunkSizeWarningLimit: Infinity,
    reportCompressedSize: false,
    rollupOptions: {
      /**
       * disable rollup 4 build INVALID_ANNOTATION warning
       * https://rollupjs.org/configuration-options/#pure
       * https://rollupjs.org/configuration-options/#onwarn
       */
      onwarn: (warning, defaultHandler) => {
        if (
          warning.code === "INVALID_ANNOTATION" &&
          warning.message.includes("/*#__PURE__*/")
        ) {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
  plugins: [react(), generouted()],
});
