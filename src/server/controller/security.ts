import express from "express";
import { makeError, throwError } from "../../api/util";
import { AuthService } from "../services/AuthService";

const securityHandler: express.RequestHandler = async (req, res, next) => {
  try {
    if (res.headersSent) {
      return next();
    }
    const userId = await AuthService.verify(req);
    if (!userId) {
      throwError({ statusCode: 401, message: "No token provided" });
    } else {
      req.headers.authorization = userId;
      next();
    }
  } catch (err) {
    const { statusCode, body } = makeError(err);
    res.status(statusCode).json(body);
  }
};

export default securityHandler;
