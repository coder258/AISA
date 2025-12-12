/*
 * @Author: 唐宇
 * @Date: 2025-11-25 17:27:46
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-12-12 14:58:37
 * @FilePath: \AISA\src\utils\runCommand.ts
 * @Description: 执行命令
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { exec, ExecException } from "child_process";
import { promisify } from "util";

export const runCommand = async (cmd: string, cwd: string) => {
  if (!cmd) return;
  if (!cmd.startsWith("npm")) return;
  try {
    const stdout = await promisify(exec)(cmd, {
      cwd,
      encoding: "utf-8",
      // stdio: ["ignore", "pipe", "pipe"],
    });
    return stdout.stdout.toString();
  } catch (error) {
    if (error && typeof error === "object" && "stdout" in error) {
      return (error as ExecException).stdout!.toString();
    }
    throw error;
  }
};
