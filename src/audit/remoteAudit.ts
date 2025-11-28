/*
 * @Author: 唐宇
 * @Date: 2025-11-27 17:20:31
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-11-27 17:22:01
 * @FilePath: \AISA\src\audit\remoteAudit.ts
 * @Description: 调用远程审计接口，获取当前项目的审计结果
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
const URL = "https://registry.npmjs.org/-/npm/v1/security/audits";

export const remoteAudit = async (
  packageName: string,
  pacakgeVersion: string
) => {
  const requestBody = {
    name: "example-audit", // 项目名字随便写
    version: "1.0.0", // 项目的版本，随便写
    requires: {
      [packageName]: pacakgeVersion,
    },
    dependencies: {
      [packageName]: {
        version: pacakgeVersion,
      },
    },
  };
  const resp = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  return await resp.json();
};
