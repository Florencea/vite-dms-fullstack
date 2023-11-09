import express from "express";
import { makeErrorResponse } from "../../api/util";

const errorController: express.ErrorRequestHandler = (err, _, res, next) => {
  if (res.headersSent) {
    next(err);
  }
  const { statusCode, body } = makeErrorResponse(err);
  res.status(statusCode).json(body);
};

export default errorController;
