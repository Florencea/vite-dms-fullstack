import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors } from "../util";

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

const status = SECURITY_SCHEME === "jwt" ? 200 : 204;
const response =
  SECURITY_SCHEME === "jwt"
    ? z
        .object({
          token: z.string(),
        })
        .required()
    : z.object({});
const responseDescription = SECURITY_SCHEME === "jwt" ? "OK" : "No Content";

interface ResAuthLoginJwtT {
  token: string;
}
type ResAuthLoginCookieT = Record<string, never>;
export type ResAuthLoginT = ResAuthLoginJwtT | ResAuthLoginCookieT;

const login = makeEndpoint({
  method: "post",
  path: "/auth",
  description: "Login to system",
  parameters,
  status,
  response,
  responseDescription,
  errors,
});

export default login;
