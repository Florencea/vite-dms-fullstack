import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors, makeZResponse } from "../util";

const SECURITY_SCHEME = process.env.VITE_API_SECURITY ?? "cookie";

const parameters = makeParameters([
  {
    name: "data",
    type: "Body",
    schema: z
      .object({
        account: z.string(),
        password: z.string(),
      })
      .required(),
  },
]);

export type ReqAuthLoginT = z.infer<(typeof parameters)["0"]["schema"]>;

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

type ResAuthLoginJwtT = { token: string };
type ResAuthLoginCookieT = Record<string, never>;
export type ResAuthLoginT = ResAuthLoginJwtT | ResAuthLoginCookieT;

const login = makeEndpoint({
  method: "post",
  path: "/auth",
  description: "Login to system",
  parameters,
  response,
  errors,
});

export default login;
