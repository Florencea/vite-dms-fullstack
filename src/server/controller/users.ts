import { zodiosContext } from "@zodios/express";
import usersApi from "../../api/users";
import {
  makeSuccessResponse,
  throwError,
  validationErrorHandler,
} from "../../api/util";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";

const ctx = zodiosContext();

const usersController = ctx.router(usersApi, { validationErrorHandler });

usersController.post("/users", (req, res, next) => {
  new AuthService(["USER_CREATE"], req.headers.authorization);
  const handler = async () => {
    try {
      const userService = new UserService();
      const data = await userService.create(req.body);
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

usersController.get("/users", (req, res, next) => {
  new AuthService(["USER_READ_LIST"], req.headers.authorization);
  const handler = async () => {
    try {
      const userService = new UserService();
      const data = await userService.getList(req.query);
      res.json(makeSuccessResponse(data));
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

usersController.get("/users/:id", (req, res, next) => {
  new AuthService(["USER_READ"], req.headers.authorization);
  const handler = async () => {
    try {
      const userService = new UserService();
      const data = await userService.get(req.params.id);
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

usersController.put("/users/:id", (req, res, next) => {
  new AuthService(["USER_UPDATE"], req.headers.authorization);
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

usersController.delete("/users/:id", (req, res, next) => {
  new AuthService(["USER_DELETE"], req.headers.authorization);
  const handler = async () => {
    try {
      const userService = new UserService();
      await userService.remove(req.params.id);
      res.json(makeSuccessResponse({}));
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

export default usersController;
