import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";
import {
  discoverAncestorSkillPaths,
  findGitRepositoryRoot,
  getAncestorSearchStart,
  walkAncestors,
} from "../src/domain/skill-discovery.ts";

function fakePathExists(paths: string[]) {
  const normalizedPaths = new Set(paths.map((path) => resolve(path)));
  return (path: string) => normalizedPaths.has(resolve(path));
}

test("finds the nearest git repository root", () => {
  const pathExists = fakePathExists(["/workspace/client/project/.git", "/workspace/.git"]);

  assert.equal(findGitRepositoryRoot("/workspace/client/project/src", pathExists), "/workspace/client/project");
});

test("starts above the current git repository", () => {
  const pathExists = fakePathExists(["/workspace/client/project/.git"]);

  assert.equal(getAncestorSearchStart("/workspace/client/project/src", pathExists), "/workspace/client");
});

test("starts at the parent directory when no git repository is found", () => {
  const pathExists = fakePathExists([]);

  assert.equal(getAncestorSearchStart("/workspace/client/project", pathExists), "/workspace/client");
});

test("walks from a directory up to the filesystem root", () => {
  assert.deepEqual(walkAncestors("/workspace/client"), ["/workspace/client", "/workspace", "/"]);
});

test("discovers ancestor skill directories and skips the global skill directory", () => {
  const pathExists = fakePathExists([
    "/workspace/client/project/.git",
    "/workspace/client/.agents/skills",
    "/workspace/.agents/skills",
    "/Users/patwoz/.agents/skills",
  ]);

  assert.deepEqual(
    discoverAncestorSkillPaths("/workspace/client/project/src", {
      homeDir: "/Users/patwoz",
      pathExists,
    }),
    ["/workspace/client/.agents/skills", "/workspace/.agents/skills"],
  );
});
