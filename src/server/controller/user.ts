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

userController.post("/user", (req, res, next) => {
  const handler = async () => {
    try {
      const userServvice = new UserService();
      const data = await userServvice.create(req.body);
      if (data) {
        res.json(makeSuccessResponse(data));
      } else {
        throwError({ statusCode: 500, message: "Server Error" });
      }
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

userController.get("/user", (req, res, next) => {
  const handler = async () => {
    try {
      const userServvice = new UserService();
      const data = await userServvice.getList(req.query);
      res.json(makeSuccessResponse(data));
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

userController.get("/user/:id", (req, res, next) => {
  const handler = async () => {
    try {
      const userServvice = new UserService();
      const data = await userServvice.get(req.params.id);
      if (data) {
        res.json(makeSuccessResponse(data));
      } else {
        throwError({ statusCode: 404, message: "User not found" });
      }
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

userController.patch("/user/:id", (req, res, next) => {
  const handler = async () => {
    try {
      const userServvice = new UserService();
      const data = await userServvice.update(req.params.id, req.body);
      if (data) {
        res.json(makeSuccessResponse(data));
      } else {
        throwError({ statusCode: 404, message: "User not found" });
      }
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

userController.delete("/user/:id", (req, res, next) => {
  const handler = async () => {
    try {
      const userServvice = new UserService();
      await userServvice.remove(req.params.id);
      res.json(makeSuccessResponse({}));
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

export default userController;
