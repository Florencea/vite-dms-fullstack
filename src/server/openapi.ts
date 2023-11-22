import { openApiBuilder } from "@zodios/openapi";
import { join } from "node:path";
import type { SwaggerUiOptions } from "swagger-ui-express";
import authApi from "../api/auth";
import usersApi from "../api/users";
import {
  API_PREFIX,
  BASE,
  DOC_DESCRIPTION,
  DOC_SECURITY_SCHEME,
  DOC_STATIC_ROUTE,
  DOC_TITLE,
  DOC_VERSION,
  FAVICON,
} from "./config";

const [security] = DOC_SECURITY_SCHEME;

export const openApiDocument = openApiBuilder({
  title: DOC_TITLE,
  version: DOC_VERSION,
  description: DOC_DESCRIPTION,
})
  .addServer({ url: API_PREFIX })
  .addSecurityScheme(...DOC_SECURITY_SCHEME)
  .setCustomTagsFn((path) => {
    return [path.split("/")[1]];
  })
  /**
   * public api below
   */
  .addPublicApi(authApi)
  /**
   * protected api below
   */
  .addProtectedApi(security, usersApi)
  .build();

export const SWAGGER_UI_OPTIONS: SwaggerUiOptions = {
  customCssUrl: [
    join(DOC_STATIC_ROUTE, "theme.css"),
    join(DOC_STATIC_ROUTE, "fonts.css"),
    join(DOC_STATIC_ROUTE, "custom.css"),
    [
      ...(DOC_SECURITY_SCHEME[0] === "token"
        ? [join(DOC_STATIC_ROUTE, "cookie.css")]
        : []),
    ],
  ] as unknown as string,
  customJs: [
    join(DOC_STATIC_ROUTE, "highlight.js"),
    join(DOC_STATIC_ROUTE, "custom.js"),
  ] as unknown as string,
  swaggerOptions: {
    docExpansion: "list",
    persistAuthorization: true,
    deepLinking: true,
    displayRequestDuration: true,
    defaultModelRendering: "example",
    defaultModelExpandDepth: 9999,
    tagsSorter: "alpha",
    filter: true,
    withCredentials: true,
    syntaxHighlight: false,
    requestSnippetsEnabled: false,
  },
  customSiteTitle: DOC_TITLE,
  customfavIcon: join(BASE, FAVICON),
};
