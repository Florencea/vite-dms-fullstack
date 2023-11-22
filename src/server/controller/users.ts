import { zodiosContext } from "@zodios/express";
import usersApi from "../../api/users";
import { validationErrorHandler } from "../../api/util";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";

const ctx = zodiosContext();

const usersController = ctx.router(usersApi, { validationErrorHandler });

usersController.post("/users", (req, res, next) => {
  const authService = new AuthService(req.headers.authorization);
  authService.authenticate(["USER_CREATE"], async () => {
    try {
      const userService = new UserService();
      await userService.create(req.body);
      res.status(201).json();
    } catch (err) {
      next(err);
    }
  });
});

usersController.get("/users", (req, res, next) => {
  const authService = new AuthService(req.headers.authorization);
  authService.authenticate(["USER_READ_LIST"], async () => {
    try {
      const userService = new UserService();
      const data = await userService.getList(req.query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  });
});

usersController.get("/users/:id", (req, res, next) => {
  const authService = new AuthService(req.headers.authorization);
  authService.authenticate(["USER_READ"], async () => {
    try {
      const userService = new UserService();
      const data = await userService.get(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  });
});

usersController.put("/users/:id", (req, res, next) => {
  const authService = new AuthService(req.headers.authorization);
  authService.authenticate(["USER_UPDATE"], async () => {
    try {
      const userServvice = new UserService();
      await userServvice.update(req.params.id, req.body);
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  });
});

usersController.delete("/users/:id", (req, res, next) => {
  const authService = new AuthService(req.headers.authorization);
  authService.authenticate(["USER_UPDATE"], async () => {
    try {
      const userService = new UserService();
      await userService.remove(req.params.id);
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  });
});

export default usersController;
