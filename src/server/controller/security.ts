import type { RequestHandler } from "express";
import { throwError } from "../../api/util";
import { AuthService } from "../services/AuthService";

const securityHandler: RequestHandler = (req, res, next) => {
  const handler = async () => {
    try {
      if (res.headersSent) {
        next();
      }
      const authService = new AuthService();
      const userMeta = await authService.verify(req);
      if (!userMeta) {
        throwError({ statusCode: 401, message: "No token provided" });
      } else {
        req.headers.authorization = JSON.stringify(userMeta);
        next();
      }
    } catch (err) {
      next(err);
    }
  };
  void handler();
};

export default securityHandler;
