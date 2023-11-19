import { PrismaClient } from "@prisma/client";
import { softDeleteExtesion, userCreateExtesion } from "./extensions";

export const prisma = new PrismaClient()
  .$extends(softDeleteExtesion())
  .$extends(userCreateExtesion());
