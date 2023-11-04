import authController from "./auth";
import userController from "./user";

export const publicControllers = [authController];
export const protectedControllers = [userController];
