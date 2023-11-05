import { makeEndpoint, makeErrors } from "@zodios/core";
import { z } from "zod";
import { makeZSuccessResponse, zError } from "../util";

const response = makeZSuccessResponse({
  data: z.object({}),
});

const errors = makeErrors([
  {
    status: 401,
    description: "Unauthorized",
    schema: zError,
  },
  {
    status: "default",
    description: "Server Error",
    schema: zError,
  },
]);

const logout = makeEndpoint({
  method: "delete",
  path: "/auth",
  description: "Logout system",
  response,
  errors,
});

export default logout;
