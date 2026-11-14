# 议场 AGORA 技术文档

## 1. 项目概述

议场 AGORA 面向校园团队、创新项目和产品评审中的“意见被少数人主导、风险没有被显式讨论、会后无法复盘”问题。系统不把 AI 当作唯一答案，而是把不同角色的观点、证据、反例和异议组织成一条可检查的决策链。

## 2. 意图控制策略

### 2.1 角色约束

每个 Agent 拥有固定角色、专业边界和原则。事实侦察员只能优先寻找证据；反方质询官必须给出失败条件；影响评估师必须指出被影响但未发声的人；共识记录官必须同时记录共识和异议。

### 2.2 结构化输出

业务层不接受自由散文作为最终状态。消息至少包含 `agentId`、`phase`、`text`、`evidence[]`；证据必须标记为事实、假设、风险或提案，并包含置信度。决议必须包含行动建议、理由、异议和下一步。

### 2.3 可逆推进

产品设计遵循“建议而非自动执行、影子模式而非直接上线、可撤回而非不可逆”的约束。这使 AI 的建议进入真实业务前先经过人类确认和可观测实验。

## 3. 架构设计

- **View**：Next.js App Router + React 客户端组件，负责交互状态与可视化。
- **Application**：`src/application/deliberation-service.ts` 负责输入规范化、事件顺序和决议编排；`/api/deliberate` 只负责 HTTP/SSE 适配，发送 `run.started`、`message.created`、`decision.ready`、`run.completed` 事件。
- **Domain**：`src/domain` 的类型、角色、冲突关系和决议构造保持纯函数，独立于 React 和 Provider。
- **Infrastructure**：`src/infrastructure/provider.ts` 定义外部模型接入边界和 Mock/Live 选择规则，避免把密钥、网络请求和领域规则混在组件里。
- **运行编排**：`scripts/agora.mjs` 提供统一的开发、健康检查、工程验证和比赛材料检查入口，吸收通用的多服务项目启动经验但不复用实习项目代码。
- **Replay**：前端以事件消息为基础渲染演进回放，展示事件类型、时间和质询关系。

## 4. 工程质量

TypeScript strict 模式；领域层有单元测试；API 使用 SSE 流式反馈；环境变量模板不含密钥；真实 Provider 可选，默认零配置启动；决议明确保留异议，避免把模型输出包装成绝对正确。

## 5. 可复现性论证

在空环境中执行 `npm install && npm run dev` 即可启动。Mock 模式不依赖网络、不依赖数据库、不依赖 API Key。核心函数 `createOpeningMessages`、`createConflicts`、`createDecision` 的输入输出稳定，并由测试覆盖。每一次交互事件都具有明确类型，后续可落盘到 JSONL 或数据库而不改变渲染模型。

## 6. 局限与后续

当前演示版本使用内存状态，刷新页面后房间不会持久化；正式决赛版本应增加 JSONL/SQLite 事件仓储、房间分享链接、脱敏数据集、真实 Provider 的超时与重试、模型输出 schema 校验，以及多用户权限控制。这些约束已纳入路线图，不以演示数据冒充真实生产能力。
