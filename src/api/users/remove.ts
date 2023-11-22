import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors } from "../util";

const parameters = makeParameters([
  {
    name: "Accept-Language",
    type: "Header",
    schema: z.string().optional(),
  },
  {
    name: "id",
    type: "Path",
    schema: z.string().cuid2(),
  },
]);

const status = 204;
const response = z.void();
const responseDescription = "No Content";

const remove = makeEndpoint({
  method: "delete",
  path: "/users/:id",
  description: "Remove user",
  parameters,
  status,
  response,
  responseDescription,
  errors,
});

export default remove;
