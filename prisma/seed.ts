import prisma from ".";

const DEFAULT_USER = {
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
    code: "F000",
    name: "Login to system",
  },
  {
    code: "F001",
    name: "Query users",
  },
  {
    code: "F002",
    name: "Create user",
  },
  {
    code: "F003",
    name: "Update user",
  },
  {
    code: "F004",
    name: "Delete user",
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
      account: DEFAULT_USER.account,
    },
    create: { ...DEFAULT_USER },
    update: { ...DEFAULT_USER },
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
