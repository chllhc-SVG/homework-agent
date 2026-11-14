#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const command = process.argv[2] ?? "help";
const root = process.cwd();
const run = (name, args) => {
  console.log(`\n▶ ${name} ${args.join(" ")}`);
  const result = spawnSync(name, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
};

switch (command) {
  case "dev":
    run(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "dev"]);
    break;
  case "verify":
    run(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "verify"]);
    break;
  case "contest":
    run(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "contest:verify"]);
    break;
  case "health": {
    const url = process.env.AGORA_HEALTH_URL ?? "http://localhost:3000";
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      console.log(`${response.ok ? "✔" : "✗"} ${url} → ${response.status}`);
      process.exitCode = response.ok ? 0 : 1;
    } catch (error) {
      console.error(`✗ ${url} → ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 1;
    }
    break;
  }
  default:
    console.log(`
议场 AGORA 工程入口

  npm run agora:dev      启动本地应用
  npm run agora:health   检查本地服务
  npm run agora:verify   运行类型检查、测试和构建
  npm run agora:contest  检查比赛提交材料结构
`);
}
