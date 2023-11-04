import { makeApi } from "@zodios/core";
import login from "./login";

const authApi = makeApi([login]);

export default authApi;
