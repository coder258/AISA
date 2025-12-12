/*
 * @Author: 唐宇
 * @Date: 2025-12-11 15:39:30
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-12-12 15:51:06
 * @FilePath: \AISA\src\cache\index.ts
 * @Description: 审计结果缓存
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import fs from "fs/promises";
import { getDirname } from "../utils/common.js";
import { join } from "path";
import { deleteWorkDir } from "../createWorkDir/index.js";

const MAX_CACHE_NUM = 30;
const cacheDir = join(getDirname(import.meta.url), "../../cache");
const cacheJsonPath = join(cacheDir, `cache.json`);

const _deleteEarliestCache = (cacheJson: any) => {
  const currentCacheNum = Object.keys(cacheJson).length;
  if (currentCacheNum >= MAX_CACHE_NUM) {
    // 如果缓存数量超过最大值，则删除最早的缓存
    const firstCacheKey = Object.keys(cacheJson)[0] as string;
    delete cacheJson[firstCacheKey];
  }
};

export const checkCache = async (packageJson: any, workDir: string) => {
  // 读取缓存文件
  let cacheJson: any;
  try {
    cacheJson = await fs.readFile(cacheJsonPath, "utf-8");
  } catch (error) {
    // 如果缓存文件不存在，则返回执行后续流程
    return;
  }
  cacheJson = JSON.parse(cacheJson);
  const { name, version } = packageJson;
  const cacheKey = `${name}-${version}`;
  const auditResultUrl = cacheJson[cacheKey];
  // 如果缓存中没有该项目的审计结果，则直接返回执行后续流程
  if (!auditResultUrl) return;
  let auditResult: any;
  try {
    auditResult = await fs.readFile(auditResultUrl, "utf-8");
  } catch (error) {
    // 读取审计结果失败，则返回执行后续流程
    return;
  }
  // 读取审计结果成功，更新文件为缓存映射表的最新顺序
  delete cacheJson[cacheKey];
  cacheJson[cacheKey] = auditResultUrl;
  try {
    // 覆盖缓存映射表
    await fs.writeFile(cacheJsonPath, JSON.stringify(cacheJson), "utf8");
  } catch (error) {
    console.error("更新缓存映射表失败");
    throw error;
  }

  await deleteWorkDir(workDir);

  console.log("缓存预检成功");

  throw {
    msg: "缓存预检成功",
    auditResultUrl,
  };
};

export const writeCache = async (packageJson: any, path: string) => {
  // 检查缓存目录是否已存在
  try {
    await fs.access(cacheDir);
  } catch {
    // 目录不存在，创建新目录
    await fs.mkdir(cacheDir, { recursive: true });
    console.log(`成功创建缓存目录: ${cacheDir}`);
  }
  // 读取缓存映射表
  let cacheJson: any;
  try {
    cacheJson = await fs.readFile(cacheJsonPath, "utf-8");
    cacheJson = JSON.parse(cacheJson);
  } catch (error) {
    // 如果缓存文件不存在，则创建新的映射表
    cacheJson = {};
  }
  const { name, version } = packageJson;
  const cacheKey = `${name}-${version}`;
  _deleteEarliestCache(cacheJson);
  delete cacheJson[cacheKey];
  cacheJson[cacheKey] = path;
  try {
    await fs.writeFile(cacheJsonPath, JSON.stringify(cacheJson), "utf8");
    console.log("缓存审计结果成功");
  } catch (error) {
    console.error("缓存审计结果失败");
    throw error;
  }
};
