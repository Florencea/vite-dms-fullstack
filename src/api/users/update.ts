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
  {
    name: "data",
    type: "Body",
    schema: z
      .object({
        email: z.string().email(),
        name: z.string(),
        phone: z.string(),
        website: z.string(),
      })
      .partial(),
  },
]);

export type ReqUsersUpdateT = z.infer<(typeof parameters)["2"]["schema"]>;

const status = 204;
const response = z.void();
const responseDescription = "No Content";

const update = makeEndpoint({
  method: "put",
  path: "/users/:id",
  description: "Update user",
  parameters,
  status,
  response,
  responseDescription,
  errors,
});

export default update;
