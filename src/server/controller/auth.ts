import { zodiosContext } from "@zodios/express";
import authApi from "../../api/auth";
import {
  makeError,
  makeResponse,
  throwError,
  validationErrorHandler,
} from "../../api/util";
import { DOC_SECURITY_SCHEME } from "../config";
import { AuthService } from "../services/AuthService";

const ctx = zodiosContext();

const authController = ctx.router(authApi, { validationErrorHandler });

authController.post("/auth", async (req, res) => {
  try {
    const data = await AuthService.login(req.body);
    if (data) {
      const [SECURITY_SCHEME] = DOC_SECURITY_SCHEME;
      if (SECURITY_SCHEME === "jwt") {
        res.json(makeResponse(data));
      } else {
        const { maxAge } = AuthService.jwtSettings;
        res
          .setHeader("Set-Cookie", [
            `${SECURITY_SCHEME}=${data.token}; HttpOnly; Path=/; Max-Age=${maxAge}; Secure=True;`,
          ])
          .json(makeResponse(data));
      }
    } else {
      throwError({ statusCode: 500, message: "Server Error" });
    }
  } catch (err) {
    const { statusCode, body } = makeError(err);
    res.status(statusCode).json(body);
  }
});

authController.delete("/auth", async (_, res) => {
  try {
    const [SECURITY_SCHEME] = DOC_SECURITY_SCHEME;
    if (SECURITY_SCHEME === "jwt") {
      res.json(makeResponse({}));
    } else {
      res
        .setHeader("Set-Cookie", [
          `${SECURITY_SCHEME}=deleted; HttpOnly; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`,
        ])
        .json(makeResponse({}));
    }
  } catch (err) {
    const { statusCode, body } = makeError(err);
    res.status(statusCode).json(body);
  }
});

export default authController;
