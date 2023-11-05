import { makeEndpoint } from "@zodios/core";
import { z } from "zod";
import { errors, makeZResponse } from "../util";

const response = makeZResponse({
  data: z.object({}),
});

const logout = makeEndpoint({
  method: "delete",
  path: "/auth",
  description: "Logout system",
  response,
  errors,
});

export default logout;
