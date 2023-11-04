import { User } from "@prisma/client";
import argon2 from "argon2";
import * as jose from "jose";
import prisma from "../../../prisma";
import { throwError } from "../../api/util";

type LoginT = {
  account: string;
  password: string;
};

export class AuthService {
  private static jwtSettings = {
    secretOrKey: "thisismysupersecretprivatekey1",
    issuer: "localhost",
    audience: "localhost",
    maxAge: 3600,
  };

  public static async login(params: LoginT) {
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

  private static async createJwt(user: User) {
    const { issuer, audience, secretOrKey, maxAge } = this.jwtSettings;
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
}
