import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors, makeZResponse } from "../util";

const parameters = makeParameters([
  {
    name: "id",
    type: "Path",
    schema: z.string(),
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

export type ResUserGetT = z.infer<typeof response>["data"];

const get = makeEndpoint({
  method: "get",
  path: "/user/:id",
  description: "Get user",
  parameters,
  response,
  errors,
});

export default get;
