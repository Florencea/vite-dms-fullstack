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

export const makeErrorResponse = (err: unknown) => {
  if (err instanceof ZError) {
    return err.zError;
  } else if (err instanceof Error) {
    const validationErrorNames = ["PrismaClientKnownRequestError"];
    const statusCode = validationErrorNames.includes(err.name) ? 400 : 500;
    const errMessage = err.message.split("\n").at(-1) ?? "Server error";
    const message = `${err.name}: ${errMessage}`;
    return {
      statusCode,
      body: {
        message,
      },
    };
  } else {
    return {
      statusCode: 500,
      body: {
        message: "Server error",
        data: {},
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
