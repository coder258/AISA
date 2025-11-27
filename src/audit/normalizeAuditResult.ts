/*
 * @Author: 唐宇
 * @Date: 2025-11-27 15:32:13
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-11-27 16:28:59
 * @FilePath: \AISA\src\audit\normalizeAuditResult.ts
 * @Description: 规范化npm audit的审计结果
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { genDepChains } from "./genDepChains.js";
import type { VulnerabilitiesType, VulnerabilityItemType } from "./index.ts";

const _normalizeVulnerabilities = (auditResult: { [key: string]: any }) => {
  const _normalizePackage = (packageInfo: {
    [key: string]: any;
  }): VulnerabilityItemType | null => {
    const { via = [] } = packageInfo;
    const validVia = via.filter((v: any) => v && typeof v === "object");
    if (validVia.length === 0) {
      return null;
    }
    const normalizedPackageInfo = {
      name: packageInfo.name,
      severity: packageInfo.severity,
      problems: validVia,
      nodes: packageInfo.nodes || [],
      depChains: genDepChains(packageInfo, auditResult.vulnerabilities),
    };

    return normalizedPackageInfo;
  };

  const result: VulnerabilitiesType = {
    critical: [],
    high: [],
    moderate: [],
    low: [],
  };

  for (const packageInfo of Object.values(auditResult.vulnerabilities)) {
    const normalizedPackage = _normalizePackage(packageInfo as any);
    if (normalizedPackage) {
      result[normalizedPackage.severity as keyof VulnerabilitiesType].push(
        normalizedPackage
      );
    }
  }

  return result;
};

export const normalizeAuditResult = (auditResult: { [key: string]: any }) => {
  return {
    vulnerabilities: _normalizeVulnerabilities(auditResult),
  };
};
