import { makeApi } from "@zodios/core";
import create from "./create";
import get from "./get";
import getList from "./getList";
import remove from "./remove";
import update from "./update";

const usersApi = makeApi([getList, create, get, update, remove]);

export default usersApi;
