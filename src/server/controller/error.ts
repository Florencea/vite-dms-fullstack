import type { ErrorRequestHandler } from "express";
import { makeErrorResponse } from "../../api/util";

const errorController: ErrorRequestHandler = (err, _, res, next) => {
  if (res.headersSent) {
    next(err);
  }
  const { statusCode, message } = makeErrorResponse(err);
  res.status(statusCode).json({ message });
};

export default errorController;
