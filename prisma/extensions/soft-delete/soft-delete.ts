import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const applyExtension = () => {
  return Prisma.defineExtension({
    name: "soft-delete",
    query: {
      $allModels: {
        aggregate: async ({ args, query }) => {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
        count: async ({ args, query }) => {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
        findFirstOrThrow: async ({ args, query }) => {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
        findUniqueOrThrow: async ({ args, query }) => {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
        findUnique: async ({ args, query }) => {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
        findFirst: async ({ args, query }) => {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
        findMany: async ({ args, query }) => {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
        groupBy: async ({ args, query }) => {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
        delete: async ({ args, model }) => {
          const modelLowerCase = model.toLowerCase() as Uncapitalize<
            typeof model
          >;
          // @ts-expect-error: Requires more types from Prisma
          return prisma[modelLowerCase].update({
            ...args,
            data: { deletedAt: new Date() },
          });
        },
        deleteMany: async ({ args, model }) => {
          const modelLowerCase = model.toLowerCase() as Uncapitalize<
            typeof model
          >;
          // @ts-expect-error: Requires more types from Prisma
          return prisma[modelLowerCase].updateMany({
            ...args,
            data: { deletedAt: new Date() },
          });
        },
      },
    },
  });
};
