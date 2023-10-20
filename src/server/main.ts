import compression from "compression";
import express from "express";
import helmet from "helmet";
import { createLogger } from "vite";
import ViteExpress from "vite-express";
import apiRouter from "./api";

const IS_PRODCTION = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT ?? "3000", 10);
const BASE = process.env.VITE_WEB_BASE ?? "/";
const API_PREFIX = process.env.VITE_API_PREFIX ?? "/api";
const HOST_URL = IS_PRODCTION
  ? `port: ${PORT}, base: ${BASE}`
  : `http://localhost:${PORT}${BASE}`;

const app = express();

if (IS_PRODCTION) {
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(compression());
}

app.use(API_PREFIX, apiRouter);

ViteExpress.listen(app, PORT, () => {
  const logger = createLogger(undefined, { prefix: "[SERVER]" });
  logger.info(`Server ready, ${HOST_URL}`, {
    timestamp: false,
  });
});
