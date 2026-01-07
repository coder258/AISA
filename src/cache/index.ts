/*
 * @Author: 唐宇
 * @Date: 2025-12-11 15:39:30
 * @LastEditors: 唐宇
 * @LastEditTime: 2026-01-07 12:15:25
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

const _updateCache = (cacheJson: any, cacheKey: any, cacheValue: any) => {
  delete cacheJson[cacheKey];
  cacheJson[cacheKey] = cacheValue;
};

/**
 * 检查是否存在缓存的审计结果
 *
 * 尝试读取缓存文件，检查是否存在指定项目的审计结果。
 * 如果存在缓存，则会更新缓存映射表的访问顺序，删除工作目录，
 * 并通过抛出异常的方式返回缓存结果。
 *
 * @param {Object} packageJson 包含项目名称和版本信息的对象
 * @param {string} workDir 工作目录路径
 * @throws {Object} 当缓存预检成功时抛出包含消息和审计结果URL的对象
 * @throws {Error} 当更新缓存映射表失败时抛出错误
 */
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
  _updateCache(cacheJson, cacheKey, auditResultUrl);
  try {
    // 覆盖缓存映射表
    await fs.writeFile(cacheJsonPath, JSON.stringify(cacheJson), "utf8");
  } catch (error) {
    console.error("更新缓存映射表失败");
    throw error;
  }

  await deleteWorkDir(workDir);

  console.log("缓存预检成功，审计结果已保存到：", auditResultUrl);

  throw {
    message: "缓存预检成功",
    auditResultUrl,
  };
};

/**
 * 将审计结果写入缓存系统
 *
 * 将指定项目的审计结果保存到缓存中。它会确保缓存目录存在，
 * 读取现有的缓存映射表，更新缓存映射表（包括删除最早的缓存项以保持缓存数量限制），
 * 并将新的审计结果信息写入缓存映射表。
 *
 * @param {Object} packageJson 包含项目名称和版本信息的对象，用于生成缓存键
 * @param {string} path 审计结果文件的存储路径，将作为缓存值保存
 * @throws {Error} 当写入缓存文件失败时抛出错误
 */
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
  _updateCache(cacheJson, cacheKey, path);
  try {
    await fs.writeFile(cacheJsonPath, JSON.stringify(cacheJson), "utf8");
    console.log("缓存审计结果成功");
  } catch (error) {
    console.error("缓存审计结果失败");
    throw error;
  }
};
