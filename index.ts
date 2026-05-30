import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Pi's built-in .agents/skills discovery stops at the git repo root.
 * Walk further up, past git boundaries, to find ancestor .agents/skills
 * directories and expose them through resources_discover.
 *
 * The global ~/.agents/skills path is excluded to avoid duplication with
 * Pi's own global skill loading.
 */
export default function (pi: ExtensionAPI) {
  pi.on("resources_discover", async (event) => {
    const skillPaths: string[] = [];

    function findGitRepoRoot(startDir: string): string | null {
      let dir = startDir;

      while (true) {
        if (existsSync(resolve(dir, ".git"))) return dir;

        const parent = dirname(dir);
        if (parent === dir) return null;

        dir = parent;
      }
    }

    const gitRoot = findGitRepoRoot(event.cwd);
    let dir = gitRoot ? dirname(gitRoot) : dirname(event.cwd);
    const home = process.env.HOME ?? "";
    const root = resolve("/");

    while (true) {
      const skillsDir = resolve(dir, ".agents", "skills");
      if (existsSync(skillsDir) && resolve(skillsDir) !== resolve(home, ".agents", "skills")) {
        skillPaths.push(skillsDir);
      }

      if (dir === root) break;

      const parent = dirname(dir);
      if (parent === dir) break;

      dir = parent;
    }

    return { skillPaths };
  });
}
