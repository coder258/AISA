/*
 * @Author: 唐宇
 * @Date: 2025-11-21 17:00:34
 * @LastEditors: 唐宇
 * @LastEditTime: 2026-01-07 10:53:29
 * @FilePath: \AISA\src\parseProject\parseLocalProject.ts
 * @Description: 解析本地项目，获取package.json信息
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { join } from "path";
import fs from "fs/promises";
import { isFrontendProject } from "./isFrontendProject.js";

export const parseLocalProject = async (projectRoot: string) => {
  const packageJsonPath = join(projectRoot, "package.json");
  try {
    let packageJson = await fs.readFile(packageJsonPath, "utf-8");
    console.log("解析本地工程成功");
    packageJson = JSON.parse(packageJson);
    if (!isFrontendProject(packageJson as unknown as Record<string, any>)) {
      throw new Error("This project is not a frontend project");
    }
    return packageJson as unknown as Record<string, any>;
  } catch (error) {
    throw new Error(`Failed to parse local package.json: ${error}`);
  }
};
