/*
 * @Author: 唐宇
 * @Date: 2025-11-20 17:08:57
 * @LastEditors: 唐宇
 * @LastEditTime: 2026-01-07 17:02:22
 * @FilePath: \AISA\src\index.ts
 * @Description: 入口文件
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { audit } from "./audit/index.js";
import { checkCache, writeCache } from "./cache/index.js";
import { createWorkDir, deleteWorkDir } from "./createWorkDir/index.js";
import { generateLock } from "./generateLock/index.js";
import { analyzeAuditResultWithAI } from "./getAIRepairSuggestions/index.js";
import { parseProject } from "./parseProject/index.js";
import { render } from "./render/index.js";
import { writeFile } from "fs/promises";

/**
 * @description: 根据传入的项目路径，审计该项目，输出规范化的审计结果并给出修复建议，审计结果为md格式
 * @param {string} projectRoot：需要审计的项目路径，可以是本地路径，也可以是远程仓库的URL
 * @param {string} path：保存审计结果的路径
 * @return {*}
 */
export const auditProject = async (projectRoot: string, path: string) => {
  let workDir = "";
  try {
    // 1.创建临时工作目录
    workDir = await createWorkDir();
    // 2.根据项目路径，解析项目，在工作目录添加package.json文件
    const packageJson = await parseProject(projectRoot);
    // 3.缓存预检
    await checkCache(packageJson, workDir);
    // 4.生成package-lock.json
    await generateLock(workDir, packageJson);
    // 5.对工作目录的package-lock.json进行审计
    const auditResult = await audit(workDir, packageJson);
    // 6.调用AI模型接口对审计结果进行分析，并给出修复建议
    const suggestion = await analyzeAuditResultWithAI(auditResult);
    // 7.渲染审计结果和修复建议
    const renderedResult = await render(auditResult, suggestion, packageJson);
    // 8.删除工作目录
    await deleteWorkDir(workDir);
    // 9.将渲染结果写入到指定路径
    await writeFile(path, renderedResult);
    // 10.缓存审计结果
    await writeCache(packageJson, path);

    return path;
  } catch (error) {
    const message = (error as Error).message;
    if (
      !message.includes("删除目录失败") &&
      !message.includes("缓存预检成功") &&
      workDir
    ) {
      await deleteWorkDir(workDir);
    }

    throw error;
  }
};

// auditProject(
//   `D:\\myData\\code\\myProjects\\react\\next\\survey-client-fe`,
//   `D:\\myData\\code\\myProjects\\react\\next\\survey-client-fe\\survey-client-fe.md`
// )
//   .then((res) => {
//     console.log(`本地工程审计完成，审计结果已保存到：${res}`);
//   })
//   .catch((error) => {
//     const { message, auditResultUrl } = error;
//     if (message === "缓存预检成功") {
//       console.log(`本地工程审计完成，审计结果已保存到：${auditResultUrl}`);
//     } else {
//       console.error("本地工程审计失败：", error);
//     }
//   });

// auditProject(
//   `https://github.com/axios/axios/tree/v0.x`,
//   `D:/myData/code/myProjects/react/axios.md`
// )
//   .then((res) => {
//     console.log(`远程工程审计完成，审计结果已保存到：${res}`);
//   })
//   .catch((error) => {
//     const { message, auditResultUrl } = error;
//     if (message === "缓存预检成功") {
//       console.log(`远程工程审计完成，审计结果已保存到：${auditResultUrl}`);
//     } else {
//       console.error("远程工程审计失败：", error);
//     }
//   });
