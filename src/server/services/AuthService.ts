import type { User } from "@prisma/client";
import argon2 from "argon2";
import type express from "express";
import * as jose from "jose";
import { prisma } from "../../../prisma";
import type { ReqAuthLoginT } from "../../api/auth/login";
import { throwError } from "../../api/util";
import { DOC_SECURITY_SCHEME, JWT_SETTINGS } from "../config";
import { I18nService } from "./I18nService";

interface UserMetaT {
  userId: string;
  isEnabled: { ok: boolean; name: string };
  isAdmin: boolean;
  functions: { code: string; name: string }[];
}

export class AuthService {
  private ADMIN_GROUP_CODE = "G000";
  private LOGIN_FUNCTION_CODE = "LOGIN";
  private userMeta?: UserMetaT;
  private i18nService: I18nService;
  private acceptLanguage?: string;

  constructor(authorization?: string, acceptLanguage?: string) {
    if (authorization) {
      const userMeta = JSON.parse(authorization) as UserMetaT;
      this.userMeta = userMeta;
    }
    this.i18nService = new I18nService();
    this.acceptLanguage = acceptLanguage;
  }

  public async authenticate(
    codes: string[],
    handler:
      | ((functions: string[]) => Promise<void>)
      | ((functions: string[]) => void),
  ) {
    await this.i18nService.loadSystemMessage(this.acceptLanguage);
    if (!this.userMeta) {
      const L_SYSTEM_00001 =
        this.i18nService.getSystemMessage("L_SYSTEM_00001");
      throwError({
        statusCode: 401,
        message: L_SYSTEM_00001,
      });
    } else {
      if (!this.userMeta.isAdmin) {
        const functionSet = new Set(
          this.userMeta.functions.map(({ code }) => code),
        );
        const codeSet = new Set(codes);
        const { ok, excluded } = this.isIncludesBy(codeSet, functionSet);
        if (!ok) {
          const functionNames = this.userMeta.functions.filter(({ code }) =>
            excluded.includes(code),
          );
          const L_SYSTEM_00002 =
            this.i18nService.getSystemMessage("L_SYSTEM_00002");
          throwError({
            statusCode: 403,
            message: `${L_SYSTEM_00002}${functionNames
              .map(({ name }) => name)
              .join(", ")}`,
          });
        } else {
          void handler(this.userMeta.functions.map(({ code }) => code));
        }
      } else {
        void handler(this.userMeta.functions.map(({ code }) => code));
      }
    }
  }

  public async login(params: ReqAuthLoginT) {
    await this.i18nService.loadSystemMessage(this.acceptLanguage);
    const { account, password } = params;
    const user = await prisma.user.findUnique({ where: { account } });
    if (!user) {
      const L_SYSTEM_00003 =
        this.i18nService.getSystemMessage("L_SYSTEM_00003");
      throwError({ statusCode: 401, message: L_SYSTEM_00003 });
    } else {
      const passwordMatch = await argon2.verify(user.password, password);
      if (!passwordMatch) {
        const L_SYSTEM_00004 =
          this.i18nService.getSystemMessage("L_SYSTEM_00004");
        throwError({ statusCode: 401, message: L_SYSTEM_00004 });
      } else {
        const userMeta = await this.getUserMeta(user);
        if (!userMeta.isEnabled.ok) {
          const L_SYSTEM_00002 =
            this.i18nService.getSystemMessage("L_SYSTEM_00002");
          throwError({
            statusCode: 403,
            message: `${L_SYSTEM_00002}${userMeta.isEnabled.name}`,
          });
        } else {
          const token = await this.createJwt(user);
          return { token };
        }
      }
    }
  }

  public getUserFunctions() {
    if (this.userMeta) {
      return this.userMeta.functions.map(({ code }) => code);
    } else {
      return [];
    }
  }

  public async verify(req: express.Request) {
    await this.i18nService.loadSystemMessage(this.acceptLanguage);
    const [SECURITY_SCHEME] = DOC_SECURITY_SCHEME;
    const cookies = req.cookies as Record<string, string>;
    const authorization =
      SECURITY_SCHEME === "jwt"
        ? req.headers.authorization
        : cookies[SECURITY_SCHEME];
    if (!authorization) {
      const L_SYSTEM_00005 =
        this.i18nService.getSystemMessage("L_SYSTEM_00005");
      throwError({ statusCode: 401, message: L_SYSTEM_00005 });
    } else {
      const token = authorization.replace("Bearer ", "");
      const id = await this.verifyJwt(token);
      if (!id) {
        const L_SYSTEM_00006 =
          this.i18nService.getSystemMessage("L_SYSTEM_00006");
        throwError({ statusCode: 401, message: L_SYSTEM_00006 });
      } else {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
          const L_SYSTEM_00003 =
            this.i18nService.getSystemMessage("L_SYSTEM_00003");
          throwError({ statusCode: 401, message: L_SYSTEM_00003 });
        } else {
          const userMeta = await this.getUserMeta(user);
          return userMeta;
        }
      }
    }
  }

  private async createJwt(user: User) {
    const { issuer, audience, secretOrKey, maxAge } = JWT_SETTINGS;
    const now = Date.now();
    const secret = new TextEncoder().encode(secretOrKey);

    const jwt = await new jose.SignJWT({
      iss: issuer,
      aud: audience,
      sub: user.id,
      exp: now + maxAge * 1000,
      iat: now,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    return jwt;
  }

  private async verifyJwt(token: string) {
    try {
      const { secretOrKey } = JWT_SETTINGS;
      const secret = new TextEncoder().encode(secretOrKey);
      const { payload } = await jose.jwtVerify(token, secret);
      return payload.sub;
    } catch {
      return undefined;
    }
  }

  private async getUserMeta(user: User) {
    const groupIds = await prisma.userGroup.findMany({
      where: {
        userId: user.id,
      },
      select: { groupId: true },
    });
    const functionIds = await prisma.groupFunction.findMany({
      where: {
        groupId: {
          in: groupIds.map(({ groupId }) => groupId),
        },
      },
      select: { functionId: true },
    });
    const functions = await prisma.function.findMany({
      where: {
        id: { in: functionIds.map(({ functionId }) => functionId) },
      },
      select: { code: true, name: true },
    });
    const adminGroup = await prisma.group.findMany({
      where: {
        id: { in: groupIds.map(({ groupId }) => groupId) },
        code: this.ADMIN_GROUP_CODE,
      },
    });
    const loginFunction = await prisma.function.findUnique({
      where: { code: this.LOGIN_FUNCTION_CODE },
    });
    const isAdmin = adminGroup.length === 1;
    const isEnabled = {
      ok: functions.some(({ code }) => code === this.LOGIN_FUNCTION_CODE),
      name: `${loginFunction?.name}`,
    };
    const userMeta: UserMetaT = {
      userId: user.id,
      isAdmin,
      isEnabled,
      functions,
    };
    return userMeta;
  }

  private isIncludesBy<T>(a: Set<T>, b: Set<T>) {
    const ok = [...a].every((i) => b.has(i));
    const excluded = [...a].filter((i) => !b.has(i));
    return {
      ok,
      excluded,
    };
  }
}
