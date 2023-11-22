import { PrismaClient } from "@prisma/client";
import { softDeleteExtesion, userCreateExtesion } from "./extensions";

export const prisma = new PrismaClient({ errorFormat: "minimal" })
  .$extends(softDeleteExtesion())
  .$extends(userCreateExtesion());
