import { PrismaClient } from "@prisma/client";
import { generateNanoidExtesion } from "./extensions/generate-nanoid";
import { softDeleteExtesion } from "./extensions/soft-delete";
import { userCreateExtesion } from "./extensions/user-create";
const prisma = new PrismaClient();

export default prisma
  .$extends(softDeleteExtesion())
  .$extends(generateNanoidExtesion())
  .$extends(userCreateExtesion());
