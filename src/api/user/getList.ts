import { makeEndpoint, makeErrors, makeParameters } from "@zodios/core";
import { z } from "zod";
import { makeZErrorResponse, makeZSuccessResponse } from "../util";

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
    schema: makeZErrorResponse({
      statusCode: 400,
      message: "Error Message",
    }),
  },
  {
    status: 401,
    description: "Unauthorized",
    schema: makeZErrorResponse({
      statusCode: 401,
      message: "Error Message",
    }),
  },
  {
    status: "default",
    description: "Server Error",
    schema: makeZErrorResponse({
      statusCode: 500,
      message: "Error Message",
    }),
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
