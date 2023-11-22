import languageParser from "accept-language-parser";
import { prisma } from "../../../prisma";
import type { ResI18nGetT } from "../../api/i18n/get";

export class I18nService {
  private DEFAULT_LOCALE = "en-US";
  private DEFAULT_PUBLIC_FUNCTIONS = ["LOGIN"];
  public async getList(
    functions: string[],
    acceptLanguage?: string,
  ): Promise<ResI18nGetT> {
    const locales = await prisma.locale.findMany({
      select: { code: true },
    });
    const localeCode =
      languageParser.pick(
        locales.map(({ code }) => code),
        acceptLanguage ?? "",
      ) ?? this.DEFAULT_LOCALE;
    const i18nList = await prisma.i18n.findMany({
      where: {
        locale: {
          code: localeCode,
        },
        function: {
          code: {
            in: functions,
            notIn: this.DEFAULT_PUBLIC_FUNCTIONS,
          },
        },
      },
      select: { code: true, value: true },
      orderBy: { code: "asc" },
    });
    const i18nObj = Object.fromEntries(
      i18nList.map(({ code, value }) => [code, value]),
    );
    return i18nObj;
  }

  public async getListPublic(acceptLanguage?: string): Promise<ResI18nGetT> {
    const locales = await prisma.locale.findMany({
      select: { code: true },
    });
    const localeCode =
      languageParser.pick(
        locales.map(({ code }) => code),
        acceptLanguage ?? "",
      ) ?? this.DEFAULT_LOCALE;
    const i18nList = await prisma.i18n.findMany({
      where: {
        locale: {
          code: localeCode,
        },
        function: {
          code: {
            in: this.DEFAULT_PUBLIC_FUNCTIONS,
          },
        },
      },
      select: { code: true, value: true },
      orderBy: { code: "asc" },
    });
    const i18nObj = Object.fromEntries(
      i18nList.map(({ code, value }) => [code, value]),
    );
    return i18nObj;
  }
}
