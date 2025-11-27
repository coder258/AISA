/*
 * @Author: 唐宇
 * @Date: 2025-11-26 15:45:41
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-11-26 16:09:04
 * @FilePath: \AISA\src\generateLock\index.ts
 * @Description: 写入package.json到工作目录，并生成package-lock.json。
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { existsSync, mkdirSync, writeFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import { runCommand } from "../utils/runCommand.js";

const writePackageJson = async (
  workDir: string,
  packageJson: { [key: string]: any }
) => {
  // 将package.json写入到工作目录
  const path = join(workDir, "package.json");
  const isWorkDirExist = existsSync(workDir);
  if (!isWorkDirExist) {
    mkdirSync(workDir, { recursive: true });
  }
  try {
    await promisify(writeFile)(path, JSON.stringify(packageJson), "utf8");
  } catch (error) {
    throw new Error(
      `写入package.json失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

const generateLockFile = async (workDir: string) => {
  // 在工作目录生成package-lock.json
  const cmd = "npm i --package-lock-only --force";
  // 执行命令
  try {
    await runCommand(cmd, workDir);
  } catch (error) {
    throw new Error(
      `生成package-lock.json失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const generateLock = async (
  workDir: string,
  packageJson: { [key: string]: any }
) => {
  // 1.将package.json写入到工作目录
  await writePackageJson(workDir, packageJson);
  // 2.在工作目录生成package-lock.json
  await generateLockFile(workDir);
};
