import { makeApi } from "@zodios/core";
import getList from "./getList";

const userApi = makeApi([getList]);

export default userApi;
