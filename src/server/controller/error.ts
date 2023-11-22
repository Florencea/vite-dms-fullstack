import { Prisma } from "@prisma/client";
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import type { ZodIssue } from "zod";
import { I18nService } from "../services/I18nService";

interface ZErrorT {
  name: string;
  message: string;
  zError: {
    statusCode: number;
    message: string;
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

export const throwZError = (params: {
  statusCode: number;
  message: string;
}) => {
  const { statusCode, message } = params;
  throw new ZError({
    name: "ZError",
    message: "Server Error",
    zError: {
      statusCode,
      message,
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

const makeErrorResponse = (err: unknown) => {
  if (err instanceof ZError) {
    return err.zError;
  } else if (err instanceof Error) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        statusCode: 400,
        message: parsePrismaError(err),
      };
    } else {
      const errMessage = err.message.split("\n").at(-1) ?? "Server error";
      return {
        statusCode: 500,
        message: `${err.name}: ${errMessage}`,
      };
    }
  } else {
    return {
      statusCode: 500,
      message: "Server error",
    };
  }
};

export const validationErrorHandler = async (
  err: {
    context: string;
    error: ZodIssue[];
  },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction,
) => {
  try {
    const i18nService = new I18nService();
    await i18nService.loadSystemMessage(req.headers["accept-language"]);
    const L_SYSTEM_00011 = i18nService.getSystemMessage("L_SYSTEM_00011");
    const message = err.error
      .map((e) => {
        return `${L_SYSTEM_00011}\`${e.path.map((s) => `${s}`).join(".")}\`, ${
          e.message
        }`;
      })
      .join("\n");
    throwZError({ statusCode: 400, message });
  } catch (err) {
    const { statusCode, message } = makeErrorResponse(err);
    res.status(statusCode).json({ message });
  }
};

const errorController: ErrorRequestHandler = (err, _, res, next) => {
  if (res.headersSent) {
    next(err);
  }
  const { statusCode, message } = makeErrorResponse(err);
  res.status(statusCode).json({ message });
};

export default errorController;
