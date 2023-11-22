import type { RequestHandler } from "express";
import { throwError } from "../../api/util";

const notfoundController: RequestHandler = (req, res, next) => {
  try {
    if (res.headersSent) {
      next();
    }
    throwError({
      statusCode: 500,
      statusMessage: `Invalid API endpoint ${req.method} ${req.url}`,
    });
  } catch (err) {
    next(err);
  }
};

export default notfoundController;
