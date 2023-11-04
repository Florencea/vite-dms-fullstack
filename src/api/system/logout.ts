import { makeEndpoint, makeErrors } from "@zodios/core";
import { z } from "zod";
import { makeZErrorResponse, makeZSuccessResponse } from "../util";

const response = makeZSuccessResponse({
  data: z.object({}),
});

const errors = makeErrors([
  {
    status: 401,
    description: "Unauthorized",
    schema: makeZErrorResponse({
      statusCode: 401,
      message: "Error Message",
    }),
  },
  {
    status: "default",
    description: "Server Error",
    schema: makeZErrorResponse({
      statusCode: 500,
      message: "Error Message",
    }),
  },
]);

const logout = makeEndpoint({
  method: "delete",
  path: "/system/auth",
  description: "Logout to system",
  response,
  errors,
});

export default logout;
