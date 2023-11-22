import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors } from "../util";

const parameters = makeParameters([
  {
    name: "id",
    type: "Path",
    schema: z.string(),
  },
]);

const status = 200;
const response = z
  .object({
    id: z.string().uuid(),
    account: z.string(),
    email: z.string().email(),
    name: z.string(),
    phone: z.string().nullable(),
    website: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date(),
  })
  .required();
const responseDescription = "OK";

export type ResUsersGetT = z.infer<typeof response>;

const get = makeEndpoint({
  method: "get",
  path: "/users/:id",
  description: "Get user",
  parameters,
  status,
  response,
  responseDescription,
  errors,
});

export default get;
