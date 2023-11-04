import dayjs from "dayjs";
import express from "express";
import { get } from "radash";
import { ZodIssue, z } from "zod";

type ZSuccessResponseParamsT<T extends Record<string, z.ZodTypeAny>> = {
  data: z.ZodObject<T>;
};

type ZErrorResponseParamsT = {
  statusCode: number;
  message: string;
};

export const makeZSuccessResponse = <T extends Record<string, z.ZodTypeAny>>(
  params: ZSuccessResponseParamsT<T>,
) => {
  const { data } = params;
  return z
    .object({
      message: z.string(),
      timestamp: z.string().datetime(),
      data,
    })
    .required();
};

export type ResponseT = z.infer<ReturnType<typeof makeZSuccessResponse>>;

export const makeResponse = <T extends Record<string, unknown>>(
  data: T,
  message?: string,
) => {
  return {
    message: message ?? "ok",
    timestamp: dayjs().toISOString(),
    data,
  } satisfies ResponseT;
};

export const zError = z
  .object({
    message: z.string(),
    timestamp: z.string().datetime(),
    data: z.object({}).default({}),
  })
  .required();

export type ErrorT = [number, z.infer<typeof zError>];

export const throwError = (params: ZErrorResponseParamsT) => {
  const { statusCode, message } = params;
  throw [
    statusCode,
    {
      message,
      timestamp: dayjs().toISOString(),
      data: {},
    },
  ] satisfies ErrorT;
};

export const makeError = (err: unknown) => {
  const errName = get<string>(err, "name", "Error");
  const errMessage =
    get<string>(err, "message", "Server error").split("\n").at(-1) ??
    "Server error";
  const errMessageForError = `${errName}: ${errMessage}`;
  const statusCode = get<number>(err, "[0]", 500);
  const message = get<string>(err, "[1].message", errMessageForError);
  return {
    statusCode,
    body: {
      message,
      timestamp: get<string>(err, "[1].timestamp", dayjs().toISOString()),
      data: {},
    },
  };
};

export const validationErrorHandler = async (
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
    const { statusCode, body } = makeError(err);
    res.status(statusCode).json(body);
  }
};
