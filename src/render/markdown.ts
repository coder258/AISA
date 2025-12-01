/*
 * @Author: 唐宇
 * @Date: 2025-12-01 15:50:05
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-12-01 17:07:19
 * @FilePath: \AISA\src\render\markdown.ts
 * @Description: 渲染markdown
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
import ejs from "ejs";
import { join } from "path";

const ejsTemplatePath = join(process.cwd(), "/src/render/template/index.ejs");

export const renderMarkdown = (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(ejsTemplatePath, data, (err, str) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(str);
      }
    });
  });
};
