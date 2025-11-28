/*
 * @Author: 唐宇
 * @Date: 2025-11-20 17:08:57
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-11-28 17:09:42
 * @FilePath: \AISA\src\index.ts
 * @Description: 入口文件
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { audit } from "./audit/index.js";
import { createWorkDir } from "./createWorkDir/index.js";
import { generateLock } from "./generateLock/index.js";
import { analyzeAuditResultWithAI } from "./getAIRepairSuggestions/index.js";
import { parseProject } from "./parseProject/index.js";

const auditProject = async (projectRoot: string, path: string) => {
  // 1.创建临时工作目录
  const workDir = await createWorkDir();
  // 2.根据项目路径，解析项目，在工作目录添加package.json文件
  const packageJson = parseProject(projectRoot);
  // 3.生成package-lock.json
  await generateLock(workDir, packageJson);
  // 4.对工作目录的package-lock.json进行审计
  const auditResult = await audit(workDir, packageJson);
  // 5.调用AI模型接口对审计结果进行分析，并给出修复建议
  const suggestion = await analyzeAuditResultWithAI(auditResult);
  // 6.渲染审计结果和修复建议
};
