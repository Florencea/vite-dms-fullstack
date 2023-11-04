import { mergeApis } from "@zodios/core";
import systemApi from "./system";

const api = mergeApis({
  system: systemApi,
});

export default api;
