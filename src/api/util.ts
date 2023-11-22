import { Prisma } from "@prisma/client";
import { makeErrors } from "@zodios/core";
import type { NextFunction, Request, Response } from "express";
import { z, type ZodIssue } from "zod";

interface ZErrorT {
  name: string;
  message: string;
  zError: {
    statusCode: number;
    statusMessage: string;
  };
}

class ZError extends Error {
  name: ZErrorT["name"];
  message: ZErrorT["message"];
  zError: ZErrorT["zError"];
  constructor({ name, message, zError }: ZErrorT) {
    super(message);
    this.name = name;
    this.message = message;
    this.zError = zError;
  }
}

export const throwError = (params: {
  statusCode: number;
  statusMessage: string;
}) => {
  const { statusCode, statusMessage } = params;
  throw new ZError({
    name: "ZError",
    message: "Server Error",
    zError: {
      statusCode,
      statusMessage,
    },
  });
};

const parsePrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
  const fields =
    (err.meta as { target?: string[] }).target
      ?.map((f) => `\`${f}\``)
      ?.join(", ") ?? "";
  switch (err.code) {
    case "P2002":
      /**
       * https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
       */
      return `Field ${fields} already exists in database`;
    default:
      return "";
  }
};

export const makeErrorResponse = (err: unknown) => {
  if (err instanceof ZError) {
    return err.zError;
  } else if (err instanceof Error) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        statusCode: 400,
        statusMessage: parsePrismaError(err),
      };
    } else {
      const errMessage = err.message.split("\n").at(-1) ?? "Server error";
      return {
        statusCode: 500,
        statusMessage: `${err.name}: ${errMessage}`,
      };
    }
  } else {
    return {
      statusCode: 500,
      statusMessage: "Server error",
    };
  }
};

export const validationErrorHandler = (
  err: {
    context: string;
    error: ZodIssue[];
  },
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction,
) => {
  try {
    const statusMessage = err.error
      .map((e) => {
        return `Field \`${e.path.map((s) => `${s}`).join(".")}\`, ${e.message}`;
      })
      .join("\n");
    throwError({ statusCode: 400, statusMessage });
  } catch (err) {
    const { statusCode, statusMessage } = makeErrorResponse(err);
    res.statusMessage = statusMessage;
    res.status(statusCode).json();
  }
};

export const errors = makeErrors([
  {
    status: "default",
    description: "Failed",
    schema: z.void(),
  },
]);
