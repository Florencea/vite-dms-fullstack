import { zodiosContext } from "@zodios/express";
import userApi from "../../api/user";
import {
  makeError,
  makeResponse,
  validationErrorHandler,
} from "../../api/util";
import { UserService } from "../services/UserService";

const ctx = zodiosContext();

const userController = ctx.router(userApi, { validationErrorHandler });

userController.get("/user/list", async (req, res) => {
  try {
    const data = await UserService.getList(req.query);
    res.json(makeResponse(data));
  } catch (err) {
    const { statusCode, body } = makeError(err);
    res.status(statusCode).json(body);
  }
});

export default userController;
