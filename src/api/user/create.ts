import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors, makeZResponse } from "../util";

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

const response = makeZResponse({
  data: z
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
    .required(),
});

const create = makeEndpoint({
  method: "post",
  path: "/user",
  description: "Create user",
  parameters,
  response,
  errors,
});

export default create;
