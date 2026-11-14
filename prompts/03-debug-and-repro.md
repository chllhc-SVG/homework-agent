# Prompt 03 · Bug 修复与确定性复现

> 归档映射：commit `235fbac` 及其验证链路。此文件记录修复意图，不是 AI 原始对话导出。提交前必须附上真实报错、Cursor 原始对话、修复前后截图和验证终端录屏。

## 我的 Prompt

请检查这个多 Agent 议事厅的类型安全和可复现性。重点检查 Agent ID 是否会出现 undefined、流式新增消息是否破坏 AgentMessage 联合类型、无 API Key 时是否能保持相同的演示路径。给出最小修复，并说明为什么不能用 any 绕过。

## AI 应答摘要

将 `agentById` 明确收敛为 `AgentProfile`，为新增事件固定 `phase` 和 `EvidenceKind` 字面量类型；使用确定性领域函数生成 demo 消息；API 以 SSE 顺序发送事件。

## 人类验收标准

- `npm run typecheck` 通过
- `npm test` 通过
- `npm run build` 通过
- 空环境打开首页可完成一次完整演示

## 真实修复记录（提交前补齐）

- [ ] 粘贴 Cursor 中的完整报错与修复对话
- [ ] 加入 typecheck 前后终端截图
- [ ] 补充最终 commit hash
