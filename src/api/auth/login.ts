import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors, makeZResponse } from "../util";

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
    ? makeZResponse({
        data: z
          .object({
            token: z.string(),
          })
          .required(),
      })
    : makeZResponse({
        data: z.object({}),
      });

const login = makeEndpoint({
  method: "post",
  path: "/auth",
  description: "Login to system",
  parameters,
  response,
  errors,
});

export default login;
