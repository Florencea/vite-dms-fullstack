import { makeEndpoint } from "@zodios/core";
import { z } from "zod";
import { errors } from "../error";

const status = 200;
const response = z.record(z.string(), z.string());
const responseDescription = "OK";

export type ResI18nGetLocalesT = z.infer<typeof response>;

const getLocales = makeEndpoint({
  method: "get",
  path: "/i18n/locales",
  description: "Get available Locales",
  status,
  response,
  responseDescription,
  errors,
});

export default getLocales;
