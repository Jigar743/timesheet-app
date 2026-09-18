import { prisma } from "./db";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
}
