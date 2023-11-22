import { Prisma } from "@prisma/client";
import { makeErrors } from "@zodios/core";
import type { NextFunction, Request, Response } from "express";
import { z, type ZodIssue } from "zod";

interface ZErrorT {
  name: string;
  message: string;
  zError: {
    statusCode: number;
    body: { message: string };
  };
}

class ZError extends Error {
  name: string;
  message: string;
  zError: {
    statusCode: number;
    body: { message: string };
  };
  constructor({ name, message, zError }: ZErrorT) {
    super(message);
    this.name = name;
    this.message = message;
    this.zError = zError;
  }
}

export const throwError = (params: { statusCode: number; message: string }) => {
  const { statusCode, message } = params;
  throw new ZError({
    name: "ZError",
    message: "Server Error",
    zError: {
      statusCode,
      body: {
        message,
      },
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
        body: {
          message: parsePrismaError(err),
        },
      };
    } else {
      const errMessage = err.message.split("\n").at(-1) ?? "Server error";
      return {
        statusCode: 500,
        body: {
          message: `${err.name}: ${errMessage}`,
        },
      };
    }
  } else {
    return {
      statusCode: 500,
      body: {
        message: "Server error",
      },
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
    const message = err.error
      .map((e) => {
        return `Field \`${e.path.map((s) => `${s}`).join(".")}\`, ${e.message}`;
      })
      .join("\n");
    throwError({ statusCode: 400, message });
  } catch (err) {
    const { statusCode, body } = makeErrorResponse(err);
    res.status(statusCode).json(body);
  }
};

export const errors = makeErrors([
  {
    status: "default",
    description: "Failed",
    schema: z
      .object({
        message: z.string(),
      })
      .required(),
  },
]);
