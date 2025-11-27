/*
 * @Author: 唐宇
 * @Date: 2025-11-26 16:54:53
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-11-27 16:16:23
 * @FilePath: \AISA\src\audit\index.ts
 * @Description: 获取项目的规范化审计结果
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { npmAudit } from "./npmAudit.js";

export type VulnerabilityItemType = {
  name: string;
  severity: string;
  problems: Array<{
    source: number;
    name: string;
    dependency: string;
    title: string;
    url: string;
    severity: string;
    cwe: string[];
    cvss: {
      score: number;
      vectorString: string;
    };
    range: string;
  }>;
  nodes: string[];
  depChains: Array<string[]>;
};

export type VulnerabilitiesType = {
  critical: VulnerabilityItemType[];
  high: VulnerabilityItemType[];
  moderate: VulnerabilityItemType[];
  low: VulnerabilityItemType[];
};

export type AuditResultType = {
  summary: {
    total: number;
    critical: number;
    high: number;
    moderate: number;
    low: number;
  };
  vulnerabilities: VulnerabilitiesType;
};

export const audit = async (
  workDir: string,
  packageJson: { [key: string]: any }
) => {
  // 获取npm audit的原始审计结果
  const auditResult = await npmAudit(workDir);
  // 解析并规范化处理审计结果
};
