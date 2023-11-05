import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors, makeZResponse } from "../util";

const parameters = makeParameters([
  {
    name: "id",
    type: "Path",
    schema: z.string(),
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

const update = makeEndpoint({
  method: "patch",
  path: "/user/:id",
  description: "Update user",
  parameters,
  response,
  errors,
});

export default update;
