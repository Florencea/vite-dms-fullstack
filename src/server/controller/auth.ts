import { zodiosContext } from "@zodios/express";
import authApi from "../../api/auth";
import {
  makeSuccessResponse,
  throwError,
  validationErrorHandler,
} from "../../api/util";
import { DOC_SECURITY_SCHEME, JWT_SETTINGS } from "../config";
import { AuthService } from "../services/AuthService";

const ctx = zodiosContext();

const authController = ctx.router(authApi, { validationErrorHandler });

authController.post("/auth", (req, res, next) => {
  const handler = async () => {
    try {
      const authService = new AuthService();
      const data = await authService.login(req.body);
      if (data) {
        const [SECURITY_SCHEME] = DOC_SECURITY_SCHEME;
        if (SECURITY_SCHEME === "jwt") {
          res.json(makeSuccessResponse(data));
        } else {
          const { maxAge } = JWT_SETTINGS;
          res
            .setHeader("Set-Cookie", [
              `${SECURITY_SCHEME}=${data.token}; HttpOnly; Path=/; Max-Age=${maxAge}; Secure=True;`,
            ])
            .json(makeSuccessResponse({}));
        }
      } else {
        throwError({ statusCode: 500, message: "Server Error" });
      }
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

authController.delete("/auth", (_, res, next) => {
  try {
    const [SECURITY_SCHEME] = DOC_SECURITY_SCHEME;
    if (SECURITY_SCHEME === "jwt") {
      res.json(makeSuccessResponse({}));
    } else {
      res
        .setHeader("Set-Cookie", [
          `${SECURITY_SCHEME}=deleted; HttpOnly; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`,
        ])
        .json(makeSuccessResponse({}));
    }
  } catch (err) {
    next(err);
  }
});

export default authController;
