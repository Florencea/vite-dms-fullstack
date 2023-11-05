import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors, makeZResponse } from "../util";

const parameters = makeParameters([
  {
    name: "current",
    type: "Query",
    schema: z.number().int().default(1),
  },
  {
    name: "pageSize",
    type: "Query",
    schema: z.number().int().default(10),
  },
]);

export type ReqUserGetListT = {
  current: number;
  pageSize: number;
};

const response = makeZResponse({
  data: z
    .object({
      list: z
        .object({
          id: z.string().uuid(),
          name: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
        })
        .array(),
      total: z.number(),
    })
    .required(),
});

export type ResUserGetListT = z.infer<typeof response>["data"];

const getList = makeEndpoint({
  method: "get",
  path: "/user",
  description: "Get user list",
  parameters,
  response,
  errors,
});

export default getList;
