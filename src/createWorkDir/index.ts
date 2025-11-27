/*
 * @Author: 唐宇
 * @Date: 2025-11-21 16:37:33
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-11-21 16:55:14
 * @FilePath: \AISA\src\createWorkDir\index.ts
 * @Description: 创建工作目录，用于存放临时文件。
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import fs from "fs/promises";
import { nanoid } from "nanoid";
import { join } from "path";

export const createWorkDir = async (): Promise<string> => {
  try {
    // 在项目根目录创建work目录
    const baseDir = join(import.meta.url, "../..", "work");
    const workDir = join(baseDir, nanoid());
    // 检查目录是否已存在
    try {
      await fs.access(workDir);
      console.log(`目录 ${workDir} 已存在`);
      return workDir;
    } catch {
      // 目录不存在，创建新目录
      await fs.mkdir(workDir, { recursive: true });
      console.log(`成功创建目录: ${workDir}`);
      return workDir;
    }
  } catch (error) {
    throw new Error(
      `创建目录失败: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

export const deleteWorkDir = async (workDir: string): Promise<void> => {
  try {
    // 检查目录是否存在
    await fs.access(workDir);
    console.log(`删除目录: ${workDir}`);
    // 删除目录及其内容
    await fs.rm(workDir, { recursive: true });
  } catch (error) {
    throw new Error(
      `删除目录失败: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
