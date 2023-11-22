import { authControllerProtected, authControllerPublic } from "./auth";
import usersController from "./users";

export const publicControllers = [authControllerPublic];
export const protectedControllers = [authControllerProtected, usersController];
