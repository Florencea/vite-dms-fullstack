import { makeApi } from "@zodios/core";
import get from "./get";
import getLocales from "./getLocales";
import getPublic from "./getPublic";

export const i18nApiPublic = makeApi([getLocales, getPublic]);
export const i18nApiProtected = makeApi([get]);
