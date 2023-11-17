import { makeErrors } from "@zodios/core";
import express from "express";
import { ZodIssue, z } from "zod";

interface ZErrorT {
  name: string;
  message: string;
  zError: {
    statusCode: number;
    body: { message: string; timestamp: Date; data: Record<string, unknown> };
  };
}

class ZError extends Error {
  name: string;
  message: string;
  zError: {
    statusCode: number;
    body: { message: string; timestamp: Date; data: Record<string, unknown> };
  };
  constructor({ name, message, zError }: ZErrorT) {
    super(message);
    this.name = name;
    this.message = message;
    this.zError = zError;
  }
}

export const makeZResponse = <T extends Record<string, z.ZodTypeAny>>(params: {
  data: z.ZodObject<T>;
}) => {
  const { data } = params;
  return z
    .object({
      message: z.string(),
      timestamp: z.date(),
      data,
    })
    .required();
};

export const throwError = (params: { statusCode: number; message: string }) => {
  const { statusCode, message } = params;
  throw new ZError({
    name: "ZError",
    message: "Server Error",
    zError: {
      statusCode,
      body: {
        message,
        timestamp: new Date(),
        data: {},
      },
    },
  });
};

export const makeSuccessResponse = <T extends object>(
  data: T,
  message?: string,
) => {
  return {
    message: message ?? "ok",
    timestamp: new Date(),
    data,
  } satisfies z.infer<ReturnType<typeof makeZResponse>>;
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
        timestamp: new Date(),
        data: {},
      },
    };
  } else {
    return {
      statusCode: 500,
      body: {
        message: "Server error",
        timestamp: new Date(),
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
  _: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: express.NextFunction,
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
        timestamp: z.date(),
        data: z.object({}).default({}),
      })
      .required(),
  },
]);
