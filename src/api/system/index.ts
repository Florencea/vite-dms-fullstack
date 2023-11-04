import { makeApi } from "@zodios/core";
import login from "./login";
import logout from "./logout";

const systemApi = makeApi([login, logout]);

export default systemApi;
