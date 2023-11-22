import authController from "./auth";
import usersController from "./users";

export const publicControllers = [authController];
export const protectedControllers = [usersController];
