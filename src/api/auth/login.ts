import { makeEndpoint, makeErrors, makeParameters } from "@zodios/core";
import { z } from "zod";
import { makeZSuccessResponse, zError } from "../util";

const SECURITY_SCHEME = process.env.VITE_API_SECURITY ?? "cookie";

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

const response =
  SECURITY_SCHEME === "jwt"
    ? makeZSuccessResponse({
        data: z
          .object({
            token: z.string(),
          })
          .required(),
      })
    : makeZSuccessResponse({
        data: z.object({}),
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
