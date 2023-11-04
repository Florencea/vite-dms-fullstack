import prisma from "../../../prisma";

type ParamsT = {
  current: number;
  pageSize: number;
};

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
    return { total, list };
  }
}
