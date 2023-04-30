import { PrismaClient, USER_TYPE } from '@prisma/client';
const prisma = new PrismaClient();

const createUsers = (type: USER_TYPE, num: number) => {
  const userType = type === USER_TYPE.BIKER ? 'biker' : 'sender';

  return Array.from({ length: num }).map((_, i) => ({
    name: userType + i,
    email: `${userType}${i}@${userType}.com`,
    password: `${userType}${i}@${userType}.com`,
  }));
};

async function main() {
  const users = [
    ...createUsers(USER_TYPE.BIKER, 10),
    ...createUsers(USER_TYPE.SENDER, 5),
  ];

  await prisma.user.createMany({
    data: users,
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
