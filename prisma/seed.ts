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

async function main() {
  const defaultGroup = await prisma.group.upsert({
    where: {
      code: DEFAULT_GROUP.code,
    },
    create: DEFAULT_GROUP,
    update: DEFAULT_GROUP,
  });
  await prisma.user.upsert({
    where: {
      account: DEFAULT_USER.account,
    },
    create: { ...DEFAULT_USER, groupPid: defaultGroup.pid },
    update: { ...DEFAULT_USER, groupPid: defaultGroup.pid },
  });
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
