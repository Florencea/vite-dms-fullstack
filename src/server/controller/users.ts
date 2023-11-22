import { zodiosContext } from "@zodios/express";
import usersApi from "../../api/users";
import { validationErrorHandler } from "../../api/util";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";

const ctx = zodiosContext();

const usersController = ctx.router(usersApi, { validationErrorHandler });

usersController.post("/users", (req, res, next) => {
  new AuthService(["USER_CREATE"], req.headers.authorization);
  const handler = async () => {
    try {
      const userService = new UserService();
      await userService.create(req.body);
      res.status(201).json({});
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
      res.json(data);
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
      res.json(data);
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
      await userServvice.update(req.params.id, req.body);
      res.status(204).json({});
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
      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  };
  void handler();
});

export default usersController;
