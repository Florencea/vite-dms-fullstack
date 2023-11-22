import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors, makeZResponse } from "../util";

const parameters = makeParameters([
  {
    name: "id",
    type: "Path",
    schema: z.string(),
  },
]);

const response = makeZResponse({
  data: z.object({}),
});

const remove = makeEndpoint({
  method: "delete",
  path: "/users/:id",
  description: "Remove user",
  parameters,
  response,
  errors,
});

export default remove;
