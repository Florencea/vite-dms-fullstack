import { Prisma } from "@prisma/client";
import { generatePublicId } from "./public-id";

export const applyExtension = () => {
  return Prisma.defineExtension({
    name: "generate-nanoid",
    query: {
      $allModels: {
        create: async ({ args, query }) => {
          args.data = { ...args.data, publicId: generatePublicId() };
          return query(args);
        },
        upsert: async ({ args, query }) => {
          args.create = { ...args.create, publicId: generatePublicId() };
          return query(args);
        },
      },
    },
  });
};
