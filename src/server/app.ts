import { zodiosApp } from "@zodios/express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { Express, static as eStatic } from "express";
import helmet from "helmet";
import logger from "morgan";
import { serve, setup } from "swagger-ui-express";
import ViteExpress from "vite-express";
import {
  API_PREFIX,
  DOC_ROUTE,
  DOC_STATIC_PATH,
  DOC_STATIC_ROUTE,
  DOC_TYPEGEN_ROUTE,
  IS_PRODCTION,
  PORT,
  SERVER_READY_MESSAGE,
} from "./config";
import { protectedControllers, publicControllers } from "./controller";
import errorController from "./controller/error";
import notfoundController from "./controller/notfound";
import securityHandler from "./controller/security";
import typegenController from "./controller/typegen";
import { SWAGGER_UI_OPTIONS, openApiDocument } from "./openapi";

const app = zodiosApp() as Express;

/**
 * Essential middleware
 */
app.disable("x-powered-by");
app.use(cookieParser());
app.use(compression());

/**
 * Secure middleware in prodction
 */
if (IS_PRODCTION) {
  app.use(helmet());
}

/**
 * OpenAPI and typegen controllers
 */
app.use(DOC_TYPEGEN_ROUTE, typegenController);
app.use(DOC_STATIC_ROUTE, eStatic(DOC_STATIC_PATH));
app.use(DOC_ROUTE, serve, setup(openApiDocument, SWAGGER_UI_OPTIONS));

/**
 * API controllers
 */
app.use(API_PREFIX, logger(IS_PRODCTION ? "common" : "dev"));
app.use(API_PREFIX, ...publicControllers);
app.use(API_PREFIX, securityHandler);
app.use(API_PREFIX, ...protectedControllers);
app.use(API_PREFIX, notfoundController);

/**
 * Error controllers
 */
app.use(errorController);

ViteExpress.listen(app, PORT, () => {
  console.info(SERVER_READY_MESSAGE);
});
