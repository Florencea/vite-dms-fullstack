import { apiKeyAuthScheme, bearerAuthScheme } from "@zodios/openapi";
import chalk from "chalk";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { exit } from "node:process";

/**
 * Is Server in production
 */
export const IS_PRODCTION = process.env.NODE_ENV === "production";
/**
 * Server port to listen
 *
 * from: `env.PORT`
 *
 * default: `3000`
 */
export const PORT = parseInt(process.env.PORT ?? "3000", 10);
/**
 * Server web base
 *
 * from: `env.VITE_WEB_BASE`
 *
 * default: `/`
 */
export const BASE = process.env.VITE_WEB_BASE ?? "/";
/**
 * Server favicon
 *
 * from: `env.VITE_FAVICON`
 *
 * default: `vite.svg`
 */
export const FAVICON = process.env.VITE_FAVICON ?? "vite.svg";
/**
 * Server API route prefix
 *
 * from: `env.VITE_API_PREFIX`
 *
 * default: `/api`
 */
export const API_PREFIX = process.env.VITE_API_PREFIX ?? "/api";
/**
 * OpenAPI swagger UI route prefix
 *
 * from: `env.VITE_DOC_PREFIX`
 *
 * default: `/openapi`
 */
export const DOC_PREFIX = process.env.VITE_DOC_PREFIX ?? "/openapi";
/**
 * OpenAPI route
 */
export const DOC_ROUTE = join(BASE, DOC_PREFIX);
/**
 * OpenAPI typegen route
 */
export const DOC_TYPEGEN_ROUTE = join(DOC_ROUTE, "typegen");
/**
 * OpenAPI static file path
 */
export const DOC_STATIC_ROUTE = join(DOC_ROUTE, "assets");
/**
 * OpenAPI static file path
 */
export const DOC_STATIC_PATH = join(__dirname, "openapi", "assets");
/**
 * OpenAPI Swagger UI title
 */
export const DOC_TITLE = process.env.VITE_TITLE
  ? `OpenAPI for ${process.env.VITE_TITLE}`
  : "Open API Docs";
/**
 * OpenAPI Swagger UI Description
 */
export const DOC_DESCRIPTION = readFileSync(
  join(__dirname, "openapi", "description.md"),
  {
    encoding: "utf-8",
  },
);
/**
 * OpenAPI Swagger UI Version
 */
export const DOC_VERSION = `${
  JSON.parse(
    readFileSync("package.json", {
      encoding: "utf-8",
    }),
  ).version
}`;
/**
 * OpenAPI Swagger Security Scheme
 */
export const DOC_SECURITY_SCHEME = [
  process.env.VITE_API_SECURITY === "jwt" ? "jwt" : "token",
  process.env.VITE_API_SECURITY === "jwt"
    ? bearerAuthScheme()
    : apiKeyAuthScheme({ in: "cookie", name: "token" }),
] as const;

const timestamp = chalk.gray(new Date().toLocaleTimeString("en-US"));
const plugin = chalk.bold.cyan("[vite-express]");
const message = chalk.green("Server Ready on");
const serverUrl = chalk.bold.cyan(
  IS_PRODCTION
    ? `port: ${PORT}, base: ${BASE}`
    : `http://localhost:${PORT}${BASE}`,
);
/**
 * Server ready message
 */
export const SERVER_READY_MESSAGE = `${timestamp} ${plugin} ${message} ${serverUrl}`;
const secretOrKey = process.env.JWT_SECRET;
const messageError = chalk.red("No JWT_SECRET found in .env.local, exit");
if (!secretOrKey) {
  console.error(`${timestamp} ${plugin} ${messageError}`);
  exit(1);
}
/**
 * JWT settings
 */
export const JWT_SETTINGS = {
  secretOrKey,
  issuer: "localhost",
  audience: "localhost",
  maxAge: 3600,
};
