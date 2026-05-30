import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { discoverAncestorSkillPaths } from "./domain/skill-discovery.ts";

export default function ancestorResources(pi: ExtensionAPI) {
  pi.on("resources_discover", (event) => ({
    skillPaths: discoverAncestorSkillPaths(event.cwd),
  }));
}
