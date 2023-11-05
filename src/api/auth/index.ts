import { makeApi } from "@zodios/core";
import login from "./login";
import logout from "./logout";

const SECURITY_SCHEME = process.env.VITE_API_SECURITY ?? "cookie";

const authApi = makeApi(SECURITY_SCHEME === "jwt" ? [login] : [login, logout]);

export default authApi;
