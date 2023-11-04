import { bearerAuthScheme, openApiBuilder } from "@zodios/openapi";
import authApi from "../../api/auth";
import userApi from "../../api/user";

const openApiDocument = openApiBuilder({
  title: `OpenAPI for ${process.env.VITE_TITLE ?? "system"}`,
  version: "1.0.0",
  description: "A simple API",
})
  .addServer({ url: "/api" })
  .addSecurityScheme("jwt", bearerAuthScheme())
  .setCustomTagsFn((path) => {
    const tagMap: Record<string, string[]> = {
      "/auth": ["auth"],
      "/user/list": ["user"],
    };
    return tagMap[path];
  })
  .addPublicApi(authApi)
  .addProtectedApi("jwt", userApi)
  .build();

export default openApiDocument;
