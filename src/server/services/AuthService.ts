import { User } from "@prisma/client";
import argon2 from "argon2";
import express from "express";
import * as jose from "jose";
import prisma from "../../../prisma";
import { ReqAuthLoginT, ResAuthLoginT } from "../../api/auth/login";
import { throwError } from "../../api/util";
import { DOC_SECURITY_SCHEME, JWT_SETTINGS } from "../config";

export class AuthService {
  public static async login(
    params: ReqAuthLoginT,
  ): Promise<ResAuthLoginT | undefined> {
    const { account, password } = params;
    const user = await prisma.user.findUnique({ where: { account } });
    if (!user) {
      throwError({ statusCode: 401, message: "User not found" });
    } else {
      const passwordMatch = await argon2.verify(user.password, password);
      if (!passwordMatch) {
        throwError({ statusCode: 401, message: "Wrong password" });
      } else {
        const token = await this.createJwt(user);
        return { token };
      }
    }
  }

  public static async verify(req: express.Request) {
    const [SECURITY_SCHEME] = DOC_SECURITY_SCHEME;
    const authorization =
      SECURITY_SCHEME === "jwt"
        ? req.headers.authorization
        : req.cookies[SECURITY_SCHEME];
    if (!authorization) {
      throwError({ statusCode: 401, message: "No token provided" });
    } else {
      const token = authorization.replace("Bearer ", "");
      const id = await this.verifyJwt(token);
      if (!id) {
        throwError({ statusCode: 401, message: "Invalid token" });
      } else {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
          throwError({ statusCode: 401, message: "User not found" });
        } else {
          return user.id;
        }
      }
    }
  }

  private static async createJwt(user: User) {
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

  private static async verifyJwt(token: string) {
    try {
      const { secretOrKey } = JWT_SETTINGS;
      const secret = new TextEncoder().encode(secretOrKey);
      const { payload } = await jose.jwtVerify(token, secret);
      return payload.sub;
    } catch {
      return undefined;
    }
  }
}
