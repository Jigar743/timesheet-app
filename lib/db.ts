import { JSONFilePreset } from "lowdb/node";
import path from "node:path";

export async function getJsonDatabase<T>(fileName: string, defaultData: T) {
  const filePath = path.join(process.cwd(), "data", fileName);

  return JSONFilePreset<T>(filePath, defaultData);
}
