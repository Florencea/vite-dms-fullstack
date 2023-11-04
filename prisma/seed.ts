import prisma from ".";

const DEFAULT_USER = {
  account: "admin",
  name: "Admin",
  email: "user@example.com",
  password: "string",
  phone: "0912345678",
  website: "admin@admin.com",
};

async function main() {
  await prisma.user.upsert({
    where: {
      account: DEFAULT_USER.account,
    },
    create: DEFAULT_USER,
    update: DEFAULT_USER,
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
