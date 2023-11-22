import type { RequestHandler } from "express";
import { throwError } from "../../api/util";
import { I18nService } from "../services/I18nService";

const notfoundController: RequestHandler = (req, res, next) => {
  const handler = async () => {
    try {
      if (res.headersSent) {
        next();
      }
      const i18nService = new I18nService();
      await i18nService.loadSystemMessage(req.headers["accept-language"]);
      const L_SYSTEM_00010 = i18nService.getSystemMessage("L_SYSTEM_00010");
      throwError({
        statusCode: 500,
        message: `${L_SYSTEM_00010}${req.method} ${req.url}`,
      });
    } catch (err) {
      next(err);
    }
  };
  void handler();
};

export default notfoundController;
