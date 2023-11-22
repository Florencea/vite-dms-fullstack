import { makeEndpoint } from "@zodios/core";
import { z } from "zod";
import { errors } from "../util";

const status = 204;
const response = z.object({});
const responseDescription = "No Content";

const logout = makeEndpoint({
  method: "delete",
  path: "/auth",
  description: "Logout system",
  status,
  response,
  responseDescription,
  errors,
});

export default logout;
