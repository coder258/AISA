/*
 * @Author: 唐宇
 * @Date: 2026-01-07 10:43:50
 * @LastEditors: 唐宇
 * @LastEditTime: 2026-01-07 11:56:08
 * @FilePath: \AISA\src\parseProject\isFrontendProject.ts
 * @Description: 前端项目特征检测
 *
 * Copyright (c) 2026 by 唐宇, All Rights Reserved.
 */
export const isFrontendProject = (
  packageJson: Record<string, any>
): boolean => {
  // 1. 检查前端框架和库
  const frontendFrameworks = [
    "react",
    "react-dom",
    "vue",
    "@angular/core",
    "svelte",
    "preact",
    "solid-js",
    "@lit/react",
  ];

  const frontendBuildTools = [
    "webpack",
    "rollup",
    "vite",
    "parcel",
    "esbuild",
    "snowpack",
    "create-react-app",
    "@vue/cli",
    "@angular/cli",
    "next",
    "nuxt",
    "gatsby",
    "remix",
    "astro",
  ];

  // 检查依赖中是否包含前端相关包
  const hasFrontendDeps = frontendFrameworks.some(
    (dep) =>
      packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
  );

  const hasFrontendBuildTool = frontendBuildTools.some(
    (tool) =>
      packageJson.dependencies?.[tool] || packageJson.devDependencies?.[tool]
  );

  // 2. 检查脚本中的前端特征
  const scripts = packageJson.scripts || {};
  const hasFrontendScripts = Object.values(scripts).some(
    (script: any) =>
      typeof script === "string" &&
      /(dev|start|build|preview|serve|test:.*)/.test(script)
  );

  // 3. 检查其他前端特征
  const hasFrontendConfig =
    packageJson.browserslist !== undefined ||
    packageJson.babel !== undefined ||
    packageJson.postcss !== undefined ||
    packageJson.stylelint !== undefined ||
    packageJson.eslintConfig !== undefined ||
    packageJson.prettier !== undefined;

  // 4. 检查 package.json 类型字段
  const isModule =
    packageJson.type === "module" ||
    packageJson.module !== undefined ||
    packageJson.exports !== undefined;

  // 满足多个条件中的几个即可认为是前端项目
  const conditions = [
    hasFrontendDeps, // 有前端框架
    hasFrontendBuildTool, // 有前端构建工具
    hasFrontendConfig, // 有前端配置文件
    isModule && hasFrontendScripts, // 是模块且有前端脚本
  ];

  // 至少满足2个条件
  const satisfiedConditions = conditions.filter(Boolean).length;

  return satisfiedConditions >= 2 || hasFrontendDeps;
};
