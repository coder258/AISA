import { exec, ExecException } from "child_process";
import { promisify } from "util";

export const runCommand = async (cmd: string, cwd: string) => {
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
    if (error && typeof error === "object" && "stderr" in error) {
      return (error as ExecException).stderr!.toString();
    }
    throw error;
  }
};
