/*
 * @Author: 唐宇
 * @Date: 2025-12-01 14:53:28
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-12-01 16:03:05
 * @FilePath: \AISA\src\render\index.ts
 * @Description: 渲染审计结果和修复建议
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { AuditResultType } from "../audit/index.js";
import { renderMarkdown } from "./markdown.js";

const desc = {
  severityLevels: {
    low: "低危",
    moderate: "中危",
    high: "高危",
    critical: "严重",
  },
};

export const render = async (
  auditResult: AuditResultType,
  suggestion: any,
  packageJson: any
) => {
  const data = {
    audit: auditResult,
    suggestion,
    desc,
    packageJson,
  };
  return await renderMarkdown(data);
};
