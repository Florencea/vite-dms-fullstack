import { makeApi } from "@zodios/core";
import get from "./get";
import login from "./login";
import logout from "./logout";

const SECURITY_SCHEME = process.env.VITE_API_SECURITY ?? "cookie";

export const authApiPublic = makeApi(
  SECURITY_SCHEME === "jwt" ? [login] : [login, logout],
);

export const authApiProtected = makeApi([get]);
