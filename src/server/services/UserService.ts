import { User } from "@prisma/client";
import prisma from "../../../prisma";
import { throwError } from "../../api/util";

type ParamsT = {
  current: number;
  pageSize: number;
};

type UserCreateT = Pick<
  User,
  "account" | "password" | "email" | "name" | "phone" | "website"
>;

type UserUpdateT = Pick<User, "email" | "name" | "phone" | "website">;

export class UserService {
  public static async getList(params: ParamsT) {
    const { current, pageSize } = params;
    const total = await prisma.user.count();
    const list = await prisma.user.findMany({
      skip: (current - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { list, total };
  }

  public static async get(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        account: true,
        email: true,
        name: true,
        phone: true,
        website: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  public static async create(data: UserCreateT) {
    const { account, password, email, name, phone, website } = data;
    const oldUser = await prisma.user.findFirst({
      where: {
        OR: [{ account }, { email }],
      },
    });
    if (oldUser) {
      if (oldUser.account === account) {
        throwError({
          statusCode: 400,
          message: "User account already exist",
        });
      } else {
        throwError({
          statusCode: 400,
          message: "User email already exist",
        });
      }
    } else {
      const user = await prisma.user.create({
        data: { account, password, email, name, phone, website },
        select: {
          id: true,
          account: true,
          email: true,
          name: true,
          phone: true,
          website: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    }
  }

  public static async update(id: string, data: Partial<UserUpdateT>) {
    const { email, name, phone, website } = data;
    const oldUser = await this.get(id);
    if (!oldUser) {
      throwError({ statusCode: 404, message: "User not found" });
    } else {
      const user = await prisma.user.update({
        where: { id },
        data: { email, name, phone, website },
        select: {
          id: true,
          account: true,
          email: true,
          name: true,
          phone: true,
          website: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    }
  }

  public static async remove(id: string) {
    const oldUser = await this.get(id);
    if (!oldUser) {
      throwError({ statusCode: 404, message: "User not found" });
    } else {
      await prisma.user.delete({
        where: { id },
      });
    }
  }
}
