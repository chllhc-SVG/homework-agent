# 演示视频时间轴与证据对应关系

录制完成后，请把“实际时间”列填写为真实视频时间点，不要预估。

## 一、功能演示与证据映射

| 实际时间 | 段落 | 画面内容 | 对应代码或证据 |
|---|---|---|---|
| 待填写 | 痛点与定位 | 首页与产品定位 | README、docs/technical.md |
| 待填写 | 创建议题 | 输入节能试点议题与背景 | src/domain/deliberation.ts |
| 待填写 | 五角色输出 | 需求、工作流、风险、合规 | src/domain/agents.ts、deliberation.ts |
| 待填写 | 交叉质询 | 主持人补充人工复核约束 | src/components/AgoraApp.tsx |
| 待填写 | 冲突图谱 | 冲突分级与处置建议 | src/domain/conflict-resolution.ts |
| 待填写 | 决议书与导出 | 下载 Markdown 决议书 | src/components/AgoraApp.tsx |
| 待填写 | AI 协同 1 | 问题分析 Prompt 与 Cursor 回复 | prompts/screenshots/01-问题分析/ |
| 待填写 | AI 协同 2 | 方案实施 Prompt 与修改 | prompts/screenshots/02-方案实施/ |
| 待填写 | AI 协同 3 | 验收 Prompt 与测试通过 | prompts/screenshots/03-验收测试/ |
| 待填写 | 浏览器差异验收 | 节能/课程/就业三场景 | prompts/screenshots/04-浏览器验收/ |
| 待填写 | 复现收尾 | typecheck、test 通过 | README 10 分钟复现指南 |

## 二、AI 协同时长自检

官网要求 AI 协同过程复现展示不少于 2 分钟。

| 段落 | 开始 | 结束 | 时长 |
|---|---|---|---|
| AI 协同 1 | 待填写 | 待填写 | 待填写 |
| AI 协同 2 | 待填写 | 待填写 | 待填写 |
| AI 协同 3 | 待填写 | 待填写 | 待填写 |
| 合计 | | | 必须 ≥ 2:00 |

## 三、Git 提交对应

| 提交 | 说明 |
|---|---|
| `b6ed9eb` | 让议题输入驱动多 Agent 协作结果 |
| `b0429f5` | 补齐输入驱动协作验收测试 |
| `31c76d2` | 建立三轮对话取证图片目录 |
| `ac10cb9` | 整理三轮 Cursor 对话证据归档 |
| `a5f10ac` | 增加第 4 轮浏览器验收目录 |

## 四、真实性约束

- 时间点必须来自真实录屏，不能事后估算后填写成“已完成”；
- AI 协同片段必须连续，不能剪掉 Prompt 输入或测试失败重试过程；
- 如果某段真实录制失败，应重新录制，而不是用截图拼接冒充操作过程。
