/*
 * @Author: 唐宇
 * @Date: 2025-11-27 15:51:44
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-11-27 16:07:53
 * @FilePath: \AISA\src\audit\genDepChains.ts
 * @Description: 根据包和包在vulnerabilities中的依赖关系，生成包的依赖链
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
export const genDepChains = (node: any, nodeMap: any) => {
  const depChains: Array<string[]> = [];
  const currentPaths: string[] = [];

  const dfs = (currentNode: any) => {
    if (!currentNode) return;
    if (currentPaths.includes(currentNode.name)) {
      depChains.push([...currentPaths]);
      return;
    }

    currentPaths.unshift(currentNode.name);

    if (!currentNode.effects || currentNode.effects.length === 0) {
      depChains.push([...currentPaths]);
      return;
    } else {
      for (const effect of currentNode.effects) {
        dfs(nodeMap[effect]);
      }
    }

    currentPaths.shift();
  };

  dfs(node);

  return depChains;
};
