import dayjs from "dayjs";
import express from "express";
import { get } from "radash";

const errorHandler: express.ErrorRequestHandler = (err, _, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    message: `${get(err, "name", "Error")}: ${get(
      err,
      "message",
      "Server Error",
    )}`,
    timestamp: dayjs().toISOString(),
    data: {},
  });
};

export default errorHandler;
