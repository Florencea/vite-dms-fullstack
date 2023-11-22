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

const I18N_ZHTW_F000 = [
  {
    code: "LF000_00001",
    value: "登入",
  },
  {
    code: "LF000_00002",
    value: "帳號",
  },
  {
    code: "LF000_00003",
    value: "密碼",
  },
  {
    code: "LF000_00004",
    value: "送出",
  },
];

const I18N_ENUS_F000 = [
  {
    code: "LF000_00001",
    value: "Login",
  },
  {
    code: "LF000_00002",
    value: "Account",
  },
  {
    code: "LF000_00003",
    value: "Password",
  },
  {
    code: "LF000_00004",
    value: "Submit",
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
              I18N_ZHTW_F000.map(async (i) => {
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
              I18N_ENUS_F000.map(async (i) => {
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
