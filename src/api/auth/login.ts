import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors } from "../error";

const SECURITY_SCHEME = process.env.VITE_API_SECURITY ?? "cookie";
const IS_JWT = SECURITY_SCHEME === "jwt";

const parameters = makeParameters([
  {
    name: "Accept-Language",
    type: "Header",
    schema: z.string().optional(),
  },
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

export type ReqAuthLoginT = z.infer<(typeof parameters)["1"]["schema"]>;

const status = 200;
const response = IS_JWT
  ? z
      .object({
        token: z.string(),
      })
      .required()
  : z.void();
const responseDescription = "OK";

interface ResAuthLoginJwtT {
  token: string;
}
export type ResAuthLoginT = ResAuthLoginJwtT | undefined;

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
