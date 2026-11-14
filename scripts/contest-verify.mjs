import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const required = [
  "README.md",
  ".env.example",
  "docs/technical.md",
  "docs/architecture-boundary.md",
  "docs/enterprise-comparison.md",
  "docs/reproducible-prompt-guide.md",
  "docs/contest-evidence-mapping.md",
  "docs/CONTEST_SUBMISSION_CHECKLIST.md",
  "prompts/README.md",
  "prompts/01-domain-and-scope.md",
  "prompts/02-ui-and-interaction.md",
  "prompts/03-debug-and-repro.md",
  "src/domain/types.ts",
  "src/domain/deliberation.ts",
  "src/domain/conflict-resolution.ts",
  "src/domain/room.ts",
  "src/application/deliberation-service.ts",
  "src/application/room-service.ts",
  "src/infrastructure/room-store.ts",
  "src/infrastructure/provider.ts",
  "src/app/api/deliberate/route.ts",
  "src/app/api/health/route.ts",
  "src/app/api/rooms/route.ts",
  "tests/deliberation.test.ts",
  "tests/conflict-resolution.test.ts",
  "tests/room.test.ts",
  "vitest.config.ts",
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error("缺少提交材料：\n" + missing.join("\n"));
  process.exit(1);
}

const commits = execFileSync("git", ["log", "--format=%H %s"], { encoding: "utf8" }).trim().split("\n");
const requiredKeywords = ["workspace", "deliberation", "议事编排", "比赛材料"];
const missingCommit = requiredKeywords.filter((keyword) => !commits.some((commit) => commit.toLowerCase().includes(keyword.toLowerCase())));
if (missingCommit.length > 0) {
  console.error("Git 演进链缺少功能提交：\n" + missingCommit.join("\n"));
  process.exit(1);
}

const readme = readFileSync("README.md", "utf8");
for (const phrase of ["10 分钟复现", "AI 对话", "演示录屏脚本", "事件溯源"]) {
  if (!readme.includes(phrase)) {
    console.error(`README 缺少复现要素：${phrase}`);
    process.exit(1);
  }
}

console.log("竞赛材料结构检查通过。请继续核对真实对话导出、截图、录屏和 PDF，不要把模板当作原始证据。");
