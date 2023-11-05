import { zodiosApp } from "@zodios/express";
import compression from "compression";
import { Express } from "express";
import helmet from "helmet";
import logger from "morgan";
import { serve, setup } from "swagger-ui-express";
import ViteExpress from "vite-express";
import { protectedControllers, publicControllers } from "./controller";
import errorHandler from "./controller/error";
import jwtHandler from "./controller/jwt";
import openApiDocument from "./openapi";

const IS_PRODCTION = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT ?? "3000", 10);
const BASE = process.env.VITE_WEB_BASE ?? "/";
const API_PREFIX = process.env.VITE_API_PREFIX ?? "/api";
const HOST_URL = IS_PRODCTION
  ? `port: ${PORT}, base: ${BASE}`
  : `http://localhost:${PORT}${BASE}`;

const app = zodiosApp();

app.disable("x-powered-by");
app.use(helmet());
app.use(compression());

app.use("/docs", serve);
app.use("/docs", setup(openApiDocument));

app.use(API_PREFIX, logger(IS_PRODCTION ? "common" : "dev"));
app.use(API_PREFIX, ...publicControllers);
app.use(API_PREFIX, jwtHandler);
app.use(API_PREFIX, ...protectedControllers);

app.use(errorHandler);

ViteExpress.listen(app as Express, PORT, () => {
  console.info(`Server ready, ${HOST_URL}`);
});
