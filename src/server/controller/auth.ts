import { zodiosContext } from "@zodios/express";
import { authApiProtected, authApiPublic } from "../../api/auth";
import { DOC_SECURITY_SCHEME, JWT_SETTINGS } from "../config";
import { AuthService } from "../services/AuthService";
import { I18nService } from "../services/I18nService";
import { throwZError, validationErrorHandler } from "./error";

const ctx = zodiosContext();

export const authControllerPublic = ctx.router(authApiPublic, {
  validationErrorHandler: void validationErrorHandler,
});
export const authControllerProtected = ctx.router(authApiProtected, {
  validationErrorHandler: void validationErrorHandler,
});

authControllerPublic.post("/auth", (req, res, next) => {
  const handler = async () => {
    try {
      const authService = new AuthService(
        undefined,
        req.headers["accept-language"],
      );
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
        const i18nService = new I18nService();
        await i18nService.loadSystemMessage(req.headers["accept-language"]);
        const L_SYSTEM_00009 = i18nService.getSystemMessage("L_SYSTEM_00009");
        throwZError({ statusCode: 500, message: L_SYSTEM_00009 });
      }
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

authControllerPublic.delete("/auth", (_, res, next) => {
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

authControllerProtected.get("/auth", (req, res, next) => {
  const authService = new AuthService(
    req.headers.authorization,
    req.headers["accept-language"],
  );
  void authService.authenticate([], () => {
    try {
      const data = authService.getUserFunctions();
      res.json(data);
    } catch (err) {
      next(err);
    }
  });
});
