import { makeEndpoint, makeErrors, makeParameters } from "@zodios/core";
import { z } from "zod";
import { makeZSuccessResponse, zError } from "../util";

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
      token: z.string(),
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

const login = makeEndpoint({
  method: "post",
  path: "/auth",
  description: "Login to system",
  parameters,
  response,
  errors,
});

export default login;
