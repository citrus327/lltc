import { prisma } from "./primsa";
export const findUserA = async () => {
  const userA = await prisma.user.findFirst({
    where: {
      name: "A",
    },
  });

  return userA;
};

export const findUserB = async () => {
  const userB = await prisma.user.findFirst({
    where: {
      name: "B",
    },
  });

  return userB;
};

export const createRecord = (payload: { settlement_id: number }) => {};
