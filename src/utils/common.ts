import { fileURLToPath } from "url";
import { dirname } from "path";

export const getFilename = (importMetaUrl: string) => {
  return fileURLToPath(importMetaUrl);
};

export const getDirname = (importMetaUrl: string) => {
  return dirname(getFilename(importMetaUrl));
};
