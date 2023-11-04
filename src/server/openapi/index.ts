import { bearerAuthScheme, openApiBuilder } from "@zodios/openapi";
import systemApi from "../../api/system";

const openApiDocument = openApiBuilder({
  title: `OpenAPI for ${process.env.VITE_TITLE ?? "system"}`,
  version: "1.0.0",
  description: "A simple API",
})
  .addServer({ url: "/api" })
  .addSecurityScheme("jwt", bearerAuthScheme())
  .addPublicApi(systemApi)
  // .addProtectedApi("admin", adminApi)
  .setCustomTagsFn((path) => {
    const tagMap: Record<string, string[]> = {
      "/system/auth": ["system"],
    };
    return tagMap?.[path] ?? ["Uncatogorized"];
  })
  .build();

export default openApiDocument;
