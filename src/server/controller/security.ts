import type { RequestHandler } from "express";
import { AuthService } from "../services/AuthService";
import { I18nService } from "../services/I18nService";
import { throwZError } from "./error";

const securityHandler: RequestHandler = (req, res, next) => {
  const handler = async () => {
    try {
      if (res.headersSent) {
        next();
      }
      const authService = new AuthService(
        undefined,
        req.headers["accept-language"],
      );
      const userMeta = await authService.verify(req);
      if (!userMeta) {
        const i18nService = new I18nService();
        await i18nService.loadSystemMessage(req.headers["accept-language"]);
        const L_SYSTEM_00005 = i18nService.getSystemMessage("L_SYSTEM_00005");
        throwZError({ statusCode: 401, message: L_SYSTEM_00005 });
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
