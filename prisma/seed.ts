import { prisma } from ".";

const DEFAULT_ADMIN = {
  account: "admin",
  name: "Admin",
  email: "user@example.com",
  password: "string",
  phone: "0912345678",
  website: "admin@admin.com",
};

const DEFAULT_GROUP = {
  code: "G000",
  name: "administrator",
  editable: false,
};

const FUNCTIONS = [
  {
    code: "LOGIN",
    name: "Login to system",
  },
  {
    code: "USER_READ_LIST",
    name: "Query users",
  },
  {
    code: "USER_READ",
    name: "Query user",
  },
  {
    code: "USER_CREATE",
    name: "Create user",
  },
  {
    code: "USER_UPDATE",
    name: "Update user",
  },
  {
    code: "USER_DELETE",
    name: "Delete user",
  },
];

const LOCALES = [
  {
    code: "zh-TW",
    name: "繁體中文",
  },
  {
    code: "en-US",
    name: "English",
  },
];

const I18N_ZHTW_LOGIN = [
  {
    code: "L_LOGIN_00001",
    value: "登入",
  },
  {
    code: "L_LOGIN_00002",
    value: "帳號",
  },
  {
    code: "L_LOGIN_00003",
    value: "密碼",
  },
  {
    code: "L_LOGIN_00004",
    value: "送出",
  },
];

const I18N_ENUS_LOGIN = [
  {
    code: "L_LOGIN_00001",
    value: "Login",
  },
  {
    code: "L_LOGIN_00002",
    value: "Account",
  },
  {
    code: "L_LOGIN_00003",
    value: "Password",
  },
  {
    code: "L_LOGIN_00004",
    value: "Submit",
  },
];

const I18N_ZHTW_USER = [
  {
    code: "L_USER_00001",
    value: "使用者管理",
  },
  {
    code: "L_USER_00002",
    value: "新增",
  },
  {
    code: "L_USER_00003",
    value: "查看",
  },
  {
    code: "L_USER_00004",
    value: "編輯",
  },
  {
    code: "L_USER_00005",
    value: "刪除",
  },
  {
    code: "L_USER_00006",
    value: "操作",
  },
  {
    code: "L_USER_00007",
    value: "名稱",
  },
  {
    code: "L_USER_00008",
    value: "建立時間",
  },
  {
    code: "L_USER_00009",
    value: "最後更新",
  },
];

const I18N_ENUS_USER = [
  {
    code: "L_USER_00001",
    value: "User Management",
  },
  {
    code: "L_USER_00002",
    value: "Add",
  },
  {
    code: "L_USER_00003",
    value: "View",
  },
  {
    code: "L_USER_00004",
    value: "Edit",
  },
  {
    code: "L_USER_00005",
    value: "Delete",
  },
  {
    code: "L_USER_00006",
    value: "Operations",
  },
  {
    code: "L_USER_00007",
    value: "Name",
  },
  {
    code: "L_USER_00008",
    value: "Created At",
  },
  {
    code: "L_USER_00009",
    value: "Last Update",
  },
];

async function main() {
  const defaultGroup = await prisma.group.upsert({
    where: {
      code: DEFAULT_GROUP.code,
    },
    create: DEFAULT_GROUP,
    update: DEFAULT_GROUP,
  });
  const defaultUser = await prisma.user.upsert({
    where: {
      account: DEFAULT_ADMIN.account,
    },
    create: { ...DEFAULT_ADMIN },
    update: { ...DEFAULT_ADMIN },
  });
  await prisma.userGroup.upsert({
    where: {
      userId_groupId: {
        userId: defaultUser.id,
        groupId: defaultGroup.id,
      },
    },
    create: {
      userId: defaultUser.id,
      groupId: defaultGroup.id,
    },
    update: {
      userId: defaultUser.id,
      groupId: defaultGroup.id,
    },
  });
  await Promise.all(
    FUNCTIONS.map(async (f) => {
      const ff = await prisma.function.upsert({
        where: {
          code: f.code,
        },
        create: f,
        update: f,
      });
      await prisma.groupFunction.upsert({
        where: {
          groupId_functionId: {
            groupId: defaultGroup.id,
            functionId: ff.id,
          },
        },
        create: {
          groupId: defaultGroup.id,
          functionId: ff.id,
        },
        update: {
          groupId: defaultGroup.id,
          functionId: ff.id,
        },
      });
      if (ff.code === "USER_READ_LIST") {
        await Promise.all(
          LOCALES.map(async (l) => {
            const ll = await prisma.locale.upsert({
              where: {
                code: l.code,
              },
              create: l,
              update: l,
            });
            if (ll.code === "zh-TW") {
              await Promise.all(
                I18N_ZHTW_USER.map(async (i) => {
                  await prisma.i18n.upsert({
                    where: {
                      code_localeId: {
                        code: i.code,
                        localeId: ll.id,
                      },
                    },
                    create: { ...i, localeId: ll.id, functionId: ff.id },
                    update: { ...i, localeId: ll.id, functionId: ff.id },
                  });
                }),
              );
            }
            if (ll.code === "en-US") {
              await Promise.all(
                I18N_ENUS_USER.map(async (i) => {
                  await prisma.i18n.upsert({
                    where: {
                      code_localeId: {
                        code: i.code,
                        localeId: ll.id,
                      },
                    },
                    create: { ...i, localeId: ll.id, functionId: ff.id },
                    update: { ...i, localeId: ll.id, functionId: ff.id },
                  });
                }),
              );
            }
          }),
        );
      }
      if (ff.code === "LOGIN") {
        await Promise.all(
          LOCALES.map(async (l) => {
            const ll = await prisma.locale.upsert({
              where: {
                code: l.code,
              },
              create: l,
              update: l,
            });
            if (ll.code === "zh-TW") {
              await Promise.all(
                I18N_ZHTW_LOGIN.map(async (i) => {
                  await prisma.i18n.upsert({
                    where: {
                      code_localeId: {
                        code: i.code,
                        localeId: ll.id,
                      },
                    },
                    create: { ...i, localeId: ll.id, functionId: ff.id },
                    update: { ...i, localeId: ll.id, functionId: ff.id },
                  });
                }),
              );
            }
            if (ll.code === "en-US") {
              await Promise.all(
                I18N_ENUS_LOGIN.map(async (i) => {
                  await prisma.i18n.upsert({
                    where: {
                      code_localeId: {
                        code: i.code,
                        localeId: ll.id,
                      },
                    },
                    create: { ...i, localeId: ll.id, functionId: ff.id },
                    update: { ...i, localeId: ll.id, functionId: ff.id },
                  });
                }),
              );
            }
          }),
        );
      }
    }),
  );
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
