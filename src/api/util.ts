import dayjs from "dayjs";
import { z } from "zod";

type ZSuccessResponseParamsT<T extends Record<string, z.ZodTypeAny>> = {
  data: z.ZodObject<T>;
};

type ZErrorResponseParamsT = {
  statusCode: 400 | 401 | 403 | 404 | 500;
  message: string;
};

export const makeZSuccessResponse = <T extends Record<string, z.ZodTypeAny>>(
  params: ZSuccessResponseParamsT<T>,
) => {
  const { data } = params;
  return z
    .object({
      success: z.boolean().default(true),
      statusCode: z.number().int().default(200),
      message: z.string().default("ok"),
      timastamp: z.string().datetime().default(dayjs().toISOString()),
      data,
    })
    .required();
};

export const makeZErrorResponse = (params: ZErrorResponseParamsT) => {
  const { statusCode, message } = params;
  return z
    .object({
      success: z.boolean().default(false),
      statusCode: z.number().int().gte(400).lt(600).default(statusCode),
      message: z.string().default(message),
      timastamp: z.string().datetime().default(dayjs().toISOString()),
      data: z.object({}).default({}),
    })
    .required();
};
