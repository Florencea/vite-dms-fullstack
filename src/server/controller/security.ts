import express from "express";
import { throwError } from "../../api/util";
import { AuthService } from "../services/AuthService";

const securityHandler: express.RequestHandler = (req, res, next) => {
  const handler = async () => {
    try {
      if (res.headersSent) {
        next();
      }
      const authService = new AuthService();
      const userId = await authService.verify(req);
      if (!userId) {
        throwError({ statusCode: 401, message: "No token provided" });
      } else {
        req.headers.authorization = userId;
        next();
      }
    } catch (err) {
      next(err);
    }
  };
  void handler();
};

export default securityHandler;
