import type { ErrorRequestHandler } from "express";
import { makeErrorResponse } from "../../api/util";

const errorController: ErrorRequestHandler = (err, _, res, next) => {
  if (res.headersSent) {
    next(err);
  }
  const { statusCode, statusMessage } = makeErrorResponse(err);
  res.statusMessage = statusMessage;
  res.status(statusCode).json();
};

export default errorController;
