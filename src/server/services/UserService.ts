import { prisma } from "../../../prisma";
import type { ReqUserCreateT, ResUserCreateT } from "../../api/user/create";
import type { ResUserGetT } from "../../api/user/get";
import type { ReqUserGetListT, ResUserGetListT } from "../../api/user/getList";
import type { ReqUserUpdateT, ResUserUpdateT } from "../../api/user/update";
import { throwError } from "../../api/util";

export class UserService {
  public async getList(params: ReqUserGetListT): Promise<ResUserGetListT> {
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

  public async get(id: string): Promise<ResUserGetT | null> {
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

  public async create(
    data: ReqUserCreateT,
  ): Promise<ResUserCreateT | undefined> {
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

  public async update(
    id: string,
    data: ReqUserUpdateT,
  ): Promise<ResUserUpdateT | undefined> {
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

  public async remove(id: string): Promise<void> {
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
