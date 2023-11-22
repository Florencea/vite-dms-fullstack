import { prisma } from "../../../prisma";
import type { ReqUsersCreateT } from "../../api/users/create";
import type {
  ReqUsersGetListT,
  ResUsersGetListT,
} from "../../api/users/getList";
import type { ReqUsersUpdateT } from "../../api/users/update";
import { throwError } from "../../api/util";
import { I18nService } from "./I18nService";

export class UserService {
  private i18nService: I18nService;
  private acceptLanguage?: string;

  constructor(acceptLanguage?: string) {
    this.i18nService = new I18nService();
    this.acceptLanguage = acceptLanguage;
  }

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
      await this.i18nService.loadSystemMessage(this.acceptLanguage);
      const L_SYSTEM_00003 =
        this.i18nService.getSystemMessage("L_SYSTEM_00003");
      throwError({ statusCode: 404, message: L_SYSTEM_00003 });
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
      await this.i18nService.loadSystemMessage(this.acceptLanguage);
      if (oldUser.account === account) {
        const L_SYSTEM_00007 =
          this.i18nService.getSystemMessage("L_SYSTEM_00007");
        throwError({
          statusCode: 400,
          message: L_SYSTEM_00007,
        });
      } else {
        const L_SYSTEM_00008 =
          this.i18nService.getSystemMessage("L_SYSTEM_00008");
        throwError({
          statusCode: 400,
          message: L_SYSTEM_00008,
        });
      }
    } else {
      await prisma.user.create({
        data: { account, password, email, name, phone, website },
      });
    }
  }

  public async update(id: string, data: ReqUsersUpdateT) {
    const { email, name, phone, website } = data;
    const oldUser = await this.get(id);
    if (!oldUser) {
      await this.i18nService.loadSystemMessage(this.acceptLanguage);
      const L_SYSTEM_00003 =
        this.i18nService.getSystemMessage("L_SYSTEM_00003");
      throwError({ statusCode: 404, message: L_SYSTEM_00003 });
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
      await this.i18nService.loadSystemMessage(this.acceptLanguage);
      const L_SYSTEM_00003 =
        this.i18nService.getSystemMessage("L_SYSTEM_00003");
      throwError({ statusCode: 404, message: L_SYSTEM_00003 });
    } else {
      await prisma.user.delete({
        where: { id },
      });
    }
  }
}
