import { zodiosContext } from "@zodios/express";
import authApi from "../../api/auth";
import {
  makeError,
  makeResponse,
  throwError,
  validationErrorHandler,
} from "../../api/util";
import { AuthService } from "../services/AuthService";

const ctx = zodiosContext();

const authController = ctx.router(authApi, { validationErrorHandler });

authController.post("/auth", async (req, res) => {
  try {
    const data = await AuthService.login(req.body);
    if (data) {
      res.status(200).json(makeResponse(data));
    } else {
      throwError({ statusCode: 500, message: "Server Error" });
    }
  } catch (err) {
    const { statusCode, body } = makeError(err);
    res.status(statusCode).json(body);
  }
});

export default authController;
