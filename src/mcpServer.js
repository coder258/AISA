import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";
import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const server = new McpServer({
  name: "audit-server",
  title: "前端工程安全审计服务",
  version: "0.1.0",
});

server.registerTool(
  "auditProject",
  {
    title: "审计前端工程",
    description:
      "审计前端工程的所有直接和间接依赖，得到安全审计结果。支持本地工程的审计，也支持远程仓库的审计（远程仓库目前仅支持github）。审计结果为标准格式的markdown字符串，不用修改结果，直接用于展示即可。",
    inputSchema: {
      projectRoot: z
        .string()
        .describe("本地工程的根路径，或者远程仓库的URL地址"),
      savePath: z
        .string()
        .describe(
          "保存审计结果的路径，传递当前工程的根路径下的工程名audit.md，如果没有当前工程，则传递桌面路径下的工程名audit.md（注意，桌面路径必须传入绝对路径）"
        ),
    },
  },
  async ({ projectRoot, savePath }) => {
    try {
      const runCommand = async (cmd, cwd) => {
        if (!cmd) return;
        if (!cmd.startsWith("npm")) return;
        try {
          const stdout = await promisify(exec)(cmd, {
            cwd,
            encoding: "utf-8",
            // stdio: ["ignore", "pipe", "pipe"],
          });
          return stdout.stdout.toString();
        } catch (error) {
          if (error && typeof error === "object" && "stdout" in error) {
            return error.stdout.toString();
          }
          throw error;
        }
      };

      await runCommand(
        "npm run build",
        join(dirname(fileURLToPath(import.meta.url))),
        "../"
      );
      const { auditProject } = await import("../dist/index.js");

      await auditProject(projectRoot, savePath);
      return {
        content: [
          {
            type: "text",
            text: `审计完成，结果已保存到: ${savePath}`,
          },
        ],
      };
    } catch (error) {
      const { message, auditResultUrl } = error;
      if (message === "缓存预检成功") {
        return {
          content: [
            {
              type: "text",
              text: `缓存预检成功，审计已完成，审计结果位于: ${auditResultUrl}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `调用MCP审计工具失败，错误信息：${JSON.stringify(error)}`,
            },
          ],
        };
      }
    }
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
