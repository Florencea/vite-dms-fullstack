import { prisma } from "../../../prisma";
import type { ReqUsersCreateT } from "../../api/users/create";
import type {
  ReqUsersGetListT,
  ResUsersGetListT,
} from "../../api/users/getList";
import type { ReqUsersUpdateT } from "../../api/users/update";
import { throwError } from "../../api/util";

export class UserService {
  public async getList(params: ReqUsersGetListT): Promise<ResUsersGetListT> {
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

  public async get(id: string) {
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
    if (!user) {
      throwError({ statusCode: 404, message: "User not found" });
    } else {
      return user;
    }
  }

  public async create(data: ReqUsersCreateT) {
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
      await prisma.user.create({
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
    }
  }

  public async update(id: string, data: ReqUsersUpdateT) {
    const { email, name, phone, website } = data;
    const oldUser = await this.get(id);
    if (!oldUser) {
      throwError({ statusCode: 404, message: "User not found" });
    } else {
      await prisma.user.update({
        where: { id },
        data: { email, name, phone, website },
      });
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
