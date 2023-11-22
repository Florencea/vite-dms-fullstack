import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors } from "../util";

const parameters = makeParameters([
  {
    name: "Accept-Language",
    type: "Header",
    schema: z.string().optional(),
  },
]);

const status = 200;
const response = z.record(z.string(), z.string());
const responseDescription = "OK";

export type ResI18nGetT = z.infer<typeof response>;

const getPublic = makeEndpoint({
  method: "get",
  path: "/i18n/public",
  description: "Get public i18n dictionary",
  parameters,
  status,
  response,
  responseDescription,
  errors,
});

export default getPublic;
