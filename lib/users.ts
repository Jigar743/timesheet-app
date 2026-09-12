import { getJsonDatabase } from "./db";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export async function getUsers() {
  const db = await getJsonDatabase<User[]>("users.json", []);

  return db.data;
}

export async function findUserByEmail(email: string) {
  const users = await getUsers();

  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}
