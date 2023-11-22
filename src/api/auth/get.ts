import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors } from "../error";

const parameters = makeParameters([
  {
    name: "Accept-Language",
    type: "Header",
    schema: z.string().optional(),
  },
]);

const status = 200;
const response = z.string().array();
const responseDescription = "OK";

export type ResUsersGetT = z.infer<typeof response>;

const get = makeEndpoint({
  method: "get",
  path: "/auth",
  description: "Get current user functions",
  parameters,
  status,
  response,
  responseDescription,
  errors,
});

export default get;
