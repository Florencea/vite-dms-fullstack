import { zodiosContext } from "@zodios/express";
import authApi from "../../api/auth";
import { throwError, validationErrorHandler } from "../../api/util";
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
          res.json(data);
        } else {
          const { maxAge } = JWT_SETTINGS;
          res
            .setHeader("Set-Cookie", [
              `${SECURITY_SCHEME}=${data.token}; HttpOnly; Path=/; Max-Age=${maxAge}; Secure=True;`,
            ])
            .json();
        }
      } else {
        throwError({ statusCode: 500, statusMessage: "Server Error" });
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
      res.status(204).json({});
    } else {
      res
        .status(204)
        .setHeader("Set-Cookie", [
          `${SECURITY_SCHEME}=deleted; HttpOnly; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`,
        ])
        .json({});
    }
  } catch (err) {
    next(err);
  }
});

export default authController;
