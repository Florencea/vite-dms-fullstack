import generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react";
import { cwd } from "node:process";
import { defineConfig, loadEnv } from "vite";

const { VITE_WEB_BASE } = loadEnv("development", cwd(), "");

export default defineConfig({
  base: VITE_WEB_BASE,
  build: {
    chunkSizeWarningLimit: Infinity,
    reportCompressedSize: false,
  },
  plugins: [react(), generouted()],
});
