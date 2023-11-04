import { makeEndpoint, makeErrors, makeParameters } from "@zodios/core";
import { z } from "zod";
import { makeZSuccessResponse, zError } from "../util";

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

const response = makeZSuccessResponse({
  data: z
    .object({
      list: z
        .object({
          id: z.string(),
          name: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
        })
        .array(),
      total: z.number(),
    })
    .required(),
});

const errors = makeErrors([
  {
    status: 400,
    description: "Bad Request",
    schema: zError,
  },
  {
    status: 401,
    description: "Unauthorized",
    schema: zError,
  },
  {
    status: "default",
    description: "Server Error",
    schema: zError,
  },
]);

const getList = makeEndpoint({
  method: "get",
  path: "/user/list",
  description: "Get user list",
  parameters,
  response,
  errors,
});

export default getList;
