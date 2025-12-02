/*
 * @Author: 唐宇
 * @Date: 2025-11-27 15:20:03
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-12-02 10:41:40
 * @FilePath: \AISA\src\audit\npmAudit.ts
 * @Description: 执行npm audit命令，并返回原始审计结果
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { runCommand } from "../utils/runCommand.js";

export const npmAudit = async (
  workDir: string
): Promise<{ [key: string]: any }> => {
  const cmd = `npm audit --json --registry=https://registry.npmjs.org/`; // 切换镜像源为官方，淘宝镜像源不支持audit命令
  const result = (await runCommand(cmd, workDir)) as string;
  const auditResult = JSON.parse(result);
  return auditResult;
};
