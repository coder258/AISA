/*
 * @Author: 唐宇
 * @Date: 2025-11-20 17:08:57
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-11-26 16:11:54
 * @FilePath: \AISA\src\index.ts
 * @Description: 入口文件
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { createWorkDir } from "./createWorkDir/index.js";
import { generateLock } from "./generateLock/index.js";
import { parseProject } from "./parseProject/index.js";

const auditProject = async (projectRoot: string, path: string) => {
  // 1.创建临时工作目录
  const workDir = await createWorkDir();
  // 2.根据项目路径，解析项目，在工作目录添加package.json文件
  const packageJson = parseProject(projectRoot);
  // 3.生成package-lock.json
  await generateLock(workDir, packageJson);
};
