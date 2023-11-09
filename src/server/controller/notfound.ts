import express from "express";
import { throwError } from "../../api/util";

const notfoundController: express.RequestHandler = (req, res, next) => {
  try {
    if (res.headersSent) {
      next();
    }
    throwError({
      statusCode: 500,
      message: `Invalid API endpoint ${req.method} ${req.url}`,
    });
  } catch (err) {
    next(err);
  }
};

export default notfoundController;
