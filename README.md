# AISA - 前端智能依赖安全审计系统

![TypeScript](https://img.shields.io/badge/TypeScript-4.5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 项目概述

AISA (Advanced Intelligent Security Auditor) 是一个基于 TypeScript 的前端智能依赖安全审计工具，专注于：

- 自动检测前端项目依赖中的安全漏洞
- 生成详细的 Markdown 格式审计报告
- 智能缓存审计结果提升性能
- 提供 AI 驱动的修复建议

## 核心特性

1. **智能缓存系统**

   - 采用 LRU 算法管理缓存（最多保留 30 个缓存项）
   - 自动淘汰最久未使用的审计结果
   - 缓存路径：`./cache/cache.json`

2. **多模块审计**

   - 支持本地项目(`parseLocalProject.ts`)
   - 支持远程项目(`parseRemoteProject.ts`)
   - 生成 Markdown 格式报告(`render/markdown.ts`)

3. **AI 修复建议**
   - 基于安全漏洞自动生成修复建议

## 安装指南

1. 克隆项目：

```bash
git clone https://github.com/coder258/AISA.git
cd AISA
```

2. 安装依赖：

```bash
npm install
```

## 使用说明

### 基本审计

```bash
npm run dev
```

### 入口文件参数说明

| 参数          | 说明                                                       | 示例                                       |
| ------------- | ---------------------------------------------------------- | ------------------------------------------ |
| `projectRoot` | 需要审计的项目路径，可以是本地路径，也可以是远程仓库的 URL | `https://github.com/axios/axios/tree/v0.x` |
| `path`        | 保存审计结果的路径                                         | `Your path`                                |

## 模块说明

| 模块                          | 职责                              |
| ----------------------------- | --------------------------------- |
| `src/createWorkDir/`          | 创建临时工作目录                  |
| `src/cache/`                  | 审计结果缓存管理                  |
| `src/parseProject/`           | 项目依赖解析                      |
| `src/generateLock/`           | 生成项目的 package-lock.json 文件 |
| `src/render/`                 | 审计报告模板渲染                  |
| `src/utils/`                  | 工具函数库                        |
| `src/audit/`                  | 依赖安全审计核心逻辑              |
| `src/getAIRepairSuggestions/` | AI 驱动的修复建议生成             |

## 项目背景

本项目旨在解决前端项目开源依赖安全审计的痛点，提供高效、智能的依赖安全管理解决方案。

## 技术栈

- TypeScript
- Node.js
- EJS
- 其他: 详见`package.json`
