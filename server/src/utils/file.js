import fs from "fs-extra";
import path from "path";
import { env } from "../config/env.js";

export const ensureUploadDir = () => {
  const dir = path.resolve(process.cwd(), env.uploadDir);
  fs.ensureDirSync(dir);
  return dir;
};

export const removeFileSafe = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.remove(filePath);
  } catch (error) {
    console.warn("[file] failed to remove", filePath, error.message);
  }
};
