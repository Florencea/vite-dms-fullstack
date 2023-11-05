import { zodiosContext } from "@zodios/express";
import userApi from "../../api/user";
import {
  makeSuccessResponse,
  throwError,
  validationErrorHandler,
} from "../../api/util";
import { UserService } from "../services/UserService";

const ctx = zodiosContext();

const userController = ctx.router(userApi, { validationErrorHandler });

userController.post("/user", async (req, res, next) => {
  try {
    const data = await UserService.create(req.body);
    if (data) {
      res.json(makeSuccessResponse(data));
    } else {
      throwError({ statusCode: 500, message: "Server Error" });
    }
  } catch (err) {
    next(err);
  }
});

userController.get("/user", async (req, res, next) => {
  try {
    const data = await UserService.getList(req.query);
    res.json(makeSuccessResponse(data));
  } catch (err) {
    next(err);
  }
});

userController.get("/user/:id", async (req, res, next) => {
  try {
    const data = await UserService.get(req.params.id);
    if (data) {
      res.json(makeSuccessResponse(data));
    } else {
      throwError({ statusCode: 404, message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
});

userController.patch("/user/:id", async (req, res, next) => {
  try {
    const data = await UserService.update(req.params.id, req.body);
    if (data) {
      res.json(makeSuccessResponse(data));
    } else {
      throwError({ statusCode: 404, message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
});

userController.delete("/user/:id", async (req, res, next) => {
  try {
    await UserService.remove(req.params.id);
    res.json(makeSuccessResponse({}));
  } catch (err) {
    next(err);
  }
});

export default userController;
