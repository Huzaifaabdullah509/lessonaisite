import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchGuides from "./tools/search-guides";
import getGuide from "./tools/get-guide";
import listPrompts from "./tools/list-prompts";
import listToolsDirectory from "./tools/list-tools-directory";
import createGuideDraft from "./tools/create-guide-draft";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "leasonai-assistant",
  title: "LeasonAI Assistant",
  version: "0.1.0",
  instructions:
    "Tools for LeasonAI, a teacher-first AI publication. Use `search_guides` and `get_guide` to read articles, `list_prompts` for classroom prompt templates, `list_tools_directory` for reviewed AI tools, and `create_guide_draft` (admin accounts only) to start a new draft article.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchGuides, getGuide, listPrompts, listToolsDirectory, createGuideDraft],
});
