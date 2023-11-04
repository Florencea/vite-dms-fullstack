import { makeEndpoint, makeErrors, makeParameters } from "@zodios/core";
import { z } from "zod";
import { makeZErrorResponse, makeZSuccessResponse } from "../util";

const parameters = makeParameters([
  {
    name: "",
    type: "Body",
    schema: z
      .object({
        account: z.string(),
        password: z.string(),
      })
      .required(),
  },
]);

const response = makeZSuccessResponse({
  data: z
    .object({
      token: z.string().default("token"),
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

const login = makeEndpoint({
  method: "post",
  path: "/system/auth",
  description: "Login to system",
  parameters,
  response,
  errors,
});

export default login;
