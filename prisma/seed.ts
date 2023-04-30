import { PrismaClient, USER_TYPE } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const hashingRounds = 5;
const createUsers = (type: USER_TYPE, num: number) => {
  const userType = type === USER_TYPE.BIKER ? 'biker' : 'sender';

  return Array.from({ length: num }).map((_, i) => {
    const hashedPassword = bcrypt.hashSync(
      `${userType}${i}@${userType}.com`,
      hashingRounds,
    );

    return {
      name: userType + i,
      email: `${userType}${i}@${userType}.com`,
      password: hashedPassword,
      type: type === 'SENDER' ? USER_TYPE.SENDER : USER_TYPE.BIKER,
    };
  });
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
