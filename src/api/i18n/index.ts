import { makeApi } from "@zodios/core";
import get from "./get";
import getPublic from "./getPublic";

export const i18nApiPublic = makeApi([getPublic]);
export const i18nApiProtected = makeApi([get]);
