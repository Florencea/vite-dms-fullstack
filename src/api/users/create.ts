import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors } from "../util";

const parameters = makeParameters([
  {
    name: "data",
    type: "Body",
    schema: z
      .object({
        account: z.string(),
        password: z.string(),
        email: z.string().email(),
        name: z.string(),
        phone: z.string().nullable(),
        website: z.string().nullable(),
      })
      .required(),
  },
]);

export type ReqUsersCreateT = z.infer<(typeof parameters)["0"]["schema"]>;

const status = 201;
const response = z.object({});
const responseDescription = "Created";

const create = makeEndpoint({
  method: "post",
  path: "/users",
  description: "Create user",
  status,
  parameters,
  response,
  responseDescription,
  errors,
});

export default create;
