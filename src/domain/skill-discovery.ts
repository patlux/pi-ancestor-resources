import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type PathExists = (path: string) => boolean;

export interface AncestorSkillDiscoveryOptions {
  homeDir?: string;
  globalSkillsDir?: string;
  pathExists?: PathExists;
}

export function discoverAncestorSkillPaths(
  cwd: string,
  options: AncestorSkillDiscoveryOptions = {},
): string[] {
  const pathExists = options.pathExists ?? existsSync;
  const startDir = getAncestorSearchStart(cwd, pathExists);
  const globalSkillsDir = getGlobalSkillsDir(options);
  const skillPaths: string[] = [];

  for (const dir of walkAncestors(startDir)) {
    const skillsDir = resolve(dir, ".agents", "skills");

    if (!pathExists(skillsDir)) continue;
    if (globalSkillsDir && samePath(skillsDir, globalSkillsDir)) continue;

    skillPaths.push(skillsDir);
  }

  return skillPaths;
}

export function findGitRepositoryRoot(cwd: string, pathExists: PathExists = existsSync): string | null {
  for (const dir of walkAncestors(resolve(cwd))) {
    if (pathExists(resolve(dir, ".git"))) return dir;
  }

  return null;
}

export function getAncestorSearchStart(cwd: string, pathExists: PathExists = existsSync): string {
  const absoluteCwd = resolve(cwd);
  const gitRoot = findGitRepositoryRoot(absoluteCwd, pathExists);

  return gitRoot ? dirname(gitRoot) : dirname(absoluteCwd);
}

export function walkAncestors(startDir: string): string[] {
  const dirs: string[] = [];
  let dir = resolve(startDir);

  while (true) {
    dirs.push(dir);

    const parent = dirname(dir);
    if (parent === dir) break;

    dir = parent;
  }

  return dirs;
}

function getGlobalSkillsDir(options: AncestorSkillDiscoveryOptions): string | undefined {
  if (options.globalSkillsDir) return resolve(options.globalSkillsDir);

  const homeDir = options.homeDir ?? process.env.HOME;
  return homeDir ? resolve(homeDir, ".agents", "skills") : undefined;
}

function samePath(left: string, right: string): boolean {
  return resolve(left) === resolve(right);
}
