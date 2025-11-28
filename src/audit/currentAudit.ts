/*
 * @Author: 唐宇
 * @Date: 2025-11-27 17:16:22
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-11-27 17:28:32
 * @FilePath: \AISA\src\audit\currentAudit.ts
 * @Description: 审计当前项目
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { remoteAudit } from "./remoteAudit.js";
const severityLevelsMap: any = {
  info: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

export const currentAudit = async (name: string, version: string) => {
  const auditResult: any = await remoteAudit(name, version);

  // 规格化审计结果
  if (
    !auditResult.advisories ||
    Object.keys(auditResult.advisories).length === 0
  ) {
    return null;
  }
  const result: any = {
    name,
    range: version,
    nodes: ["."],
    depChains: [],
  };
  const advisories: any = Object.values(auditResult.advisories);
  let maxSeverity = "info";
  result.problems = advisories.map((advisory: any) => {
    const problem = {
      source: advisory.id,
      name,
      dependency: name,
      title: advisory.title,
      url: advisory.url,
      severity: advisory.severity,
      cwe: advisory.cwe,
      cvss: advisory.cvss,
      range: advisory.vulnerable_versions,
    };
    // 更新最大严重性
    if (severityLevelsMap[problem.severity] > severityLevelsMap[maxSeverity]) {
      maxSeverity = problem.severity;
    }
    return problem;
  });
  result.severity = maxSeverity;
  return result;
};
