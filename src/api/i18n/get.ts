import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors } from "../util";

const parameters = makeParameters([
  {
    name: "Accept-Language",
    type: "Header",
    schema: z.string().default("en-US"),
  },
]);

const status = 200;
const response = z.record(z.string(), z.string());
const responseDescription = "OK";

export type ResI18nGetT = z.infer<typeof response>;

const get = makeEndpoint({
  method: "get",
  path: "/i18n",
  description: "Get current user i18n dictionary",
  parameters,
  status,
  response,
  responseDescription,
  errors,
});

export default get;
