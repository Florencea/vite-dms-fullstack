import { zodiosContext } from "@zodios/express";
import { i18nApiProtected, i18nApiPublic } from "../../api/i18n";
import { validationErrorHandler } from "../../api/util";
import { AuthService } from "../services/AuthService";
import { I18nService } from "../services/I18nService";

const ctx = zodiosContext();

export const i18nControllerPublic = ctx.router(i18nApiPublic, {
  validationErrorHandler: void validationErrorHandler,
});

export const i18nControllerProtected = ctx.router(i18nApiProtected, {
  validationErrorHandler: void validationErrorHandler,
});

i18nControllerPublic.get("/i18n/locales", (_, res, next) => {
  const handler = async () => {
    try {
      const i18nService = new I18nService();
      const data = await i18nService.getLocales();
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

i18nControllerPublic.get("/i18n/public", (req, res, next) => {
  const handler = async () => {
    try {
      const i18nService = new I18nService();
      const data = await i18nService.getListPublic(
        req.headers["accept-language"],
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

i18nControllerProtected.get("/i18n", (req, res, next) => {
  const authService = new AuthService(req.headers.authorization);
  void authService.authenticate([], async (functions) => {
    try {
      const i18nService = new I18nService();
      const data = await i18nService.getList(
        functions,
        req.headers["accept-language"],
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  });
});
