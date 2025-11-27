/*
 * @Author: 唐宇
 * @Date: 2025-11-21 17:00:26
 * @LastEditors: 唐宇
 * @LastEditTime: 2025-11-25 17:21:38
 * @FilePath: \AISA\src\parseProject\utils\parseRemoteProject.ts
 * @Description: 解析远程项目，获取package.json等息
 *
 * Copyright (c) 2025 by 唐宇, All Rights Reserved.
 */
type GithubInfoType = {
  owner: string;
  repo: string;
  path: string;
};

const isFrontendProject = (packageJson: Record<string, any>): boolean => {
  // 检查常见前端项目特征
  const hasFrontendDependencies = [
    'react',
    'vue',
    'angular',
    'svelte',
    'webpack',
    'rollup',
    'vite',
    'parcel',
    'create-react-app',
    '@vue/cli'
  ].some(keyword => 
    packageJson.dependencies?.[keyword] || 
    packageJson.devDependencies?.[keyword] ||
    packageJson.keywords?.includes(keyword)
  );

  const hasScripts = packageJson.scripts && Object.keys(packageJson.scripts).length > 0;
  const hasMainFile = packageJson.main || packageJson.module || packageJson.browser;

  return hasFrontendDependencies || (hasScripts && !hasMainFile);
};

const getGithubInfoByRemoteUrl = (remoteUrl: string): GithubInfoType => {
  try {
    const url = new URL(remoteUrl);
    // 确保是GitHub的URL
    if (url.hostname !== "github.com") {
      throw new Error("RemoteUrl is not a GitHub URL");
    }

    // 解析路径
    const pathParts = url.pathname.split("/").filter(Boolean);

    // 确保路径至少包含owner和repo
    if (pathParts.length < 2) {
      throw new Error("Invalid GitHub URL: missing owner or repo");
    }

    const owner = pathParts[0] as string;
    const repo = pathParts[1] as string;
    const restPaths = pathParts.slice(2);

    // 构造剩余路径
    const path = restPaths.length > 0 ? restPaths.join("/") : "";

    return {
      owner,
      repo,
      path,
    };
  } catch (error) {
    throw new Error("Failed to parse GitHub URL: URL is invalid or missing");
  }
};

const getRemotePackageJson = async (githubInfo: GithubInfoType) => {
  let { owner, repo, path } = githubInfo;
  if (path.startsWith("/tree/")) {
    // 处理特定分支
    const pathParts = path.split("/").filter(Boolean);
    path = `tags/${pathParts[1]}`;
  } else {
    // 获取主分支
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const info = (await fetch(url).then((res) => res.json())) as Record<
      string,
      string
    >;
    path = `heads/${info.default_branch}`;
  }

  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${path}/package.json`;
  return fetch(url).then(async (res) => {
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Package.json file not found in the project");
      }
      throw new Error(`Failed to fetch package.json: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<Record<string, any>>;
  });
};

export const parseRemoteProject = async (remoteUrl: string) => {
  try {
    const githubInfo = getGithubInfoByRemoteUrl(remoteUrl);
    const packageJson = await getRemotePackageJson(githubInfo);
    
    if (!isFrontendProject(packageJson)) {
      throw new Error("This project is not a frontend project");
    }
    
    return packageJson;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Package.json file not found")) {
        throw new Error("Failed to get package.json: The project does not contain a package.json file");
      }
      throw error;
    }
    throw new Error("Failed to parse remote project");
  }
};
