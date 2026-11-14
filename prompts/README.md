# AI 对话历史提交规范

本目录是比赛提交材料的一部分。**只有从 Cursor/Windsurf/其他 AI IDE 导出的原始对话、截图或录屏，才能作为真实证据提交。** 本仓库不会把模板、总结或程序生成文本冒充为 AI 原始对话。

## 目录约定

每个核心迭代一个文件夹：

```text
prompts/
  01-domain-and-scope.md
  02-ui-and-interaction.md
  03-debug-and-repro.md
  raw/
    01-cursor-export.html
    02-cursor-export.html
    03-cursor-export.html
  screenshots/
    01-prompt.png
    01-response.png
    01-fix.png
  recordings/
    01-domain.mp4
```

## 每个核心迭代必须包含

1. 人类原始 Prompt，包含目标、约束、上下文和验收标准；
2. AI 原始回复或导出文件；
3. 人类对建议的取舍说明；
4. 至少一次 Bug/类型错误/交互问题的复现；
5. 人类如何引导 AI 修复的后续 Prompt；
6. 修复后的验证结果；
7. 对应 Git commit hash；
8. 截图或录屏的文件名和时间戳。

## 当前三个迭代与 Git 对应关系

| 迭代 | 功能 | 对应 commit | 原始材料状态 |
|---|---|---|---|
| 01 | 领域模型、Agent 角色、证据结构 | `c9a99de` | 需补 Cursor 原始导出/截图 |
| 02 | 议事厅、冲突图谱、决议书、回放 | `589b2ff` | 需补 Cursor 原始导出/录屏 |
| 03 | 类型修复、测试、SSE 可复现链路 | `235fbac` 及其前序验证 | 需补报错/修复前后截图 |

## 从 Cursor 导出后如何归档

- 不修改原始导出文件的内容；
- 如果包含本机路径、邮箱、Token、API Key，先打码再提交；
- 保留原始文件的 SHA-256，写入对应迭代文件；
- 截图必须能看见 Prompt、AI 修改建议和文件/终端上下文；
- 录屏必须能看见输入 Prompt、AI 生成或修改过程、运行验证结果；
- 不要用人工重写的摘要替代原始对话。

## 证据真实性声明

本目录的说明文件用于规定归档格式和建立功能—提交—证据映射。提交比赛前，参赛者必须将实际发生的 AI 对话导出物、截图和录屏放入本目录，并逐项完成检查。没有原始材料的条目不能宣称“已完成 AI 对话举证”。
