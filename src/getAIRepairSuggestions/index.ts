/*
 * @Author: 唐宇
 * @Date: 2025-11-28 10:38:15
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-12-01 17:32:57
 * @FilePath: \AISA\src\getAIRepairSuggestions\index.ts
 * @Description: 调用ai模型接口，分析审计结果，给出修复建议
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import { OpenAI } from "openai";

const BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";

// 配置OpenAI客户端，指向阿里云百炼的兼容端点
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 从环境变量读取API密钥
  baseURL: BASE_URL, // 阿里云兼容接口地址[citation:6][citation:9]
});

/**
 * 将审计结果JSON发送给通义千问模型进行分析
 * @param {object} normalizedAuditResultJsonData - 要分析的JSON数据
 */
export const analyzeAuditResultWithAI = async (
  normalizedAuditResultJsonData: any
) => {
  try {
    // 构建发送给AI的消息
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "你作为一个专业的前端开发工程师，现在用户给你提供一段很大的JSON数据，代表了一个前端项目的依赖包的安全审计结果，请你仔细阅读并分析，给出合理、清晰的修复建议，给出的修复建议应该简明、直达重点，并在建议的结尾换行，提示用户谨慎操作，AI建议仅供参考。",
      },
      {
        role: "user",
        content: `这是需要你分析的JSON数据：\n\`\`\`\n${JSON.stringify(
          normalizedAuditResultJsonData
        )}\n\`\`\`\n\n`,
      },
    ];

    // 调用通义千问API
    const completion = await client.chat.completions.create({
      model: "qwen-turbo", // 指定使用通义千问Turbo模型，可根据需要更换为其他型号如qwen-plus[citation:9]
      messages: messages,
      temperature: 0.3, // 控制回复的随机性，0-1之间，值越高回答越多样
      max_tokens: 1000, // 限制回复的最大长度
    });

    // 输出AI的回复
    console.log("通义千问分析结果:");
    console.log(completion.choices[0]!.message.content);

    return completion.choices[0]!.message.content;
  } catch (error) {
    console.error("调用通义千问API时发生错误:", error);
    throw error;
  }
};
