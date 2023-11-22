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

const status = 204;
const response = z.object({});
const responseDescription = "No Content";

const logout = makeEndpoint({
  method: "delete",
  path: "/auth",
  description: "Logout system",
  parameters,
  status,
  response,
  responseDescription,
  errors,
});

export default logout;
