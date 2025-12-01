/*
 * @Author: 唐宇
 * @Date: 2025-11-20 17:08:57
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-12-01 17:31:23
 * @FilePath: \AISA\src\index.ts
 * @Description: 入口文件
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { audit } from "./audit/index.js";
import { createWorkDir, deleteWorkDir } from "./createWorkDir/index.js";
import { generateLock } from "./generateLock/index.js";
import { analyzeAuditResultWithAI } from "./getAIRepairSuggestions/index.js";
import { parseProject } from "./parseProject/index.js";
import { render } from "./render/index.js";
import { writeFile } from "fs/promises";

const auditProject = async (projectRoot: string, path: string) => {
  // 1.创建临时工作目录
  const workDir = await createWorkDir();
  // 2.根据项目路径，解析项目，在工作目录添加package.json文件
  const packageJson = parseProject(projectRoot);
  // 3.生成package-lock.json
  await generateLock(workDir, packageJson);
  // 4.对工作目录的package-lock.json进行审计
  const auditResult = await audit(workDir, packageJson);
  console.log("auditResult", auditResult);
  // // 5.调用AI模型接口对审计结果进行分析，并给出修复建议
  // const suggestion = await analyzeAuditResultWithAI(auditResult);
  // // 6.渲染审计结果和修复建议
  // const renderedResult = await render(auditResult, suggestion, packageJson);
  // // 7.删除工作目录
  // await deleteWorkDir(workDir);
  // // 8.将渲染结果写入到指定路径
  // await writeFile(path, renderedResult);
};

// auditProject(
//   `D:/myData/code/myProjects/react/survey-frontend`,
//   `D:/myData/code/myProjects/react/survey-frontend/survey-frontend.md`
// ).then(() => {
//   console.log("本地工程审计完成");
// });

auditProject(
  `https://github.com/webpack/webpack-dev-server/tree/v4.9.3`,
  `D:/myData/code/myProjects/react/webpack-dev-server_4_9_3.md`
).then(() => {
  console.log("远程工程审计完成");
});
