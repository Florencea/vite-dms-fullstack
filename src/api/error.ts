import { makeErrors } from "@zodios/core";
import { z } from "zod";

export const errors = makeErrors([
  {
    status: "default",
    description: "Failed",
    schema: z.object({ message: z.string() }).required(),
  },
]);
