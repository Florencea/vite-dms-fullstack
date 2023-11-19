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
      userPid_groupPid: {
        userPid: defaultUser.pid,
        groupPid: defaultGroup.pid,
      },
    },
    create: {
      userPid: defaultUser.pid,
      groupPid: defaultGroup.pid,
    },
    update: {
      userPid: defaultUser.pid,
      groupPid: defaultGroup.pid,
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
          groupPid_functionPid: {
            groupPid: defaultGroup.pid,
            functionPid: ff.pid,
          },
        },
        create: {
          groupPid: defaultGroup.pid,
          functionPid: ff.pid,
        },
        update: {
          groupPid: defaultGroup.pid,
          functionPid: ff.pid,
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
                    code_localePid: {
                      code: i.code,
                      localePid: ll.pid,
                    },
                  },
                  create: { ...i, localePid: ll.pid, functionPid: ff.pid },
                  update: { ...i, localePid: ll.pid, functionPid: ff.pid },
                });
              }),
            );
          }
          if (ll.code === "en-US") {
            await Promise.all(
              I18N_ENUS_F000.map(async (i) => {
                await prisma.i18n.upsert({
                  where: {
                    code_localePid: {
                      code: i.code,
                      localePid: ll.pid,
                    },
                  },
                  create: { ...i, localePid: ll.pid, functionPid: ff.pid },
                  update: { ...i, localePid: ll.pid, functionPid: ff.pid },
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
