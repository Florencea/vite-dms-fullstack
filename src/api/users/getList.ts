import { makeEndpoint, makeParameters } from "@zodios/core";
import { z } from "zod";
import { errors } from "../util";

const parameters = makeParameters([
  {
    name: "current",
    type: "Query",
    schema: z.number().int().default(1),
  },
  {
    name: "pageSize",
    type: "Query",
    schema: z.number().int().default(10),
  },
]);

export interface ReqUsersGetListT {
  current: number;
  pageSize: number;
}

const status = 200;
const response = z
  .object({
    list: z
      .object({
        id: z.string().uuid(),
        name: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
      .array(),
    total: z.number(),
  })
  .required();
const responseDescription = "OK";

export type ResUsersGetListT = z.infer<typeof response>;

const getList = makeEndpoint({
  method: "get",
  path: "/users",
  description: "Get user list",
  parameters,
  status,
  response,
  responseDescription,
  errors,
});

export default getList;
