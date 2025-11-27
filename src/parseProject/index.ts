/*
 * @Author: 唐宇
 * @Date: 2025-11-21 16:56:24
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-11-27 15:19:08
 * @FilePath: \AISA\src\parseProject\index.ts
 * @Description: 解析工程目录的package.json，支持本地和远程仓库。
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { parseLocalProject } from "./parseLocalProject.js";
import { parseRemoteProject } from "./parseRemoteProject.js";

export const parseProject = (projectRoot: string) => {
  const isRemoteUrl =
    projectRoot.startsWith("http://") || projectRoot.startsWith("https://");
  if (isRemoteUrl) {
    return parseRemoteProject(projectRoot);
  }
  return parseLocalProject(projectRoot);
};
