import { defineConfig } from "tsup";
import { config } from "dotenv";

config();

export default defineConfig({
  entry: ["src/**/*.ts"],
  bundle: false, // 每个文件单独编译
  splitting: false, // 不分割代码
  outDir: "dist",
  format: ["esm"],
  target: "node18",
  // 生成类型定义
  dts: false,
  sourcemap: true,
  clean: true,
  // 忽略特定文件
  ignoreWatch: ["**/*.ejs", "**/*.json"],
  // 注入环境变量
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  },
  // 替换 process.env 调用
  define: {
    "process.env.OPENAI_API_KEY": JSON.stringify(
      process.env.OPENAI_API_KEY || ""
    ),
  },
  // 排除 Node.js 内置模块
  external: [
    "node:child_process",
    "node:util",
    "node:url",
    "node:crypto",
    "node:fs",
    "node:path",
  ],
  // 添加 banner
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
      globalThis.require = require;
    `,
  },
});
