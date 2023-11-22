import { authControllerProtected, authControllerPublic } from "./auth";
import { i18nControllerProtected, i18nControllerPublic } from "./i18n";
import usersController from "./users";

export const publicControllers = [authControllerPublic, i18nControllerPublic];
export const protectedControllers = [
  authControllerProtected,
  usersController,
  i18nControllerProtected,
];
