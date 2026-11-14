# 提交材料包

本目录用于存放官网最终提交所需的成品材料。源码和过程材料仍在仓库其他目录，这里只放“可直接提交”的版本。

## 官网要求与对应文件

| 官网要求 | 对应成品 | 状态 |
|---|---|---|
| 代码仓库链接（Public） | <https://github.com/chllhc-SVG/homework-agent> | 待确认 Public |
| 细粒度 Git 提交历史 | 仓库 Git log，见 `docs/contest-evidence-mapping.md` | 已完成 |
| 至少 3 轮完整 AI 对话 Prompt 链 | `prompts/screenshots/01—04`、`prompts/raw/` | 部分完成，待补齐原始导出 |
| README 10 分钟复现指南 | `README.md`、`.env.example` | 已完成 |
| 演示视频 5—8 分钟 MP4 1080p | 录制后放入 `demo/` | 待录制 |
| 技术文档 PDF ≤30 页 | `deliverables/technical-document.md` 导出 | 待导出 PDF |
| 原创性与真实性 | `README.md`、`docs/architecture-boundary.md` | 已完成 |

## 建议最终上传清单

```text
01-GitHub仓库链接.txt
02-演示视频-议场AGORA.mp4
03-技术文档-议场AGORA.pdf
04-AI对话证据-说明与截图索引.pdf
05-Prompt原始记录-脱敏版.zip
```

## 文件生成说明

### 技术文档 PDF

1. 打开 `deliverables/technical-document.md`；
2. 使用 Typora / VS Code Markdown PDF 插件 / Pandoc 导出 PDF；
3. 检查页数 ≤ 30；如超出，删除附录中的重复说明而不是删除必需章节；
4. 导出后文件命名：`技术文档-议场AGORA.pdf`。

参考命令（需本机安装 pandoc 和中文字体）：

```bash
pandoc deliverables/technical-document.md -o deliverables/技术文档-议场AGORA.pdf --pdf-engine=xelatex -V CJKmainfont="Microsoft YaHei" -V geometry:margin=2cm
```

### AI 对话证据 PDF

把 `prompts/screenshots/01—04` 的截图按顺序导出为一个 PDF，并在每页标注：

```text
轮次、Prompt 编号、对应 Git 提交、录制时间
```

## 大文件约定

视频和 PDF 若体积较大，不建议直接提交到 Git 仓库。请在提交表中登记文件名、大小、SHA-256 和访问方式，并把可提交的说明文档保留在仓库内。

## 禁止事项

- 不要把截图说成视频；
- 不要把模板说明说成 Cursor 原始对话；
- 不要虚报页数或时长；
- 不要提交含密钥、个人信息或公司内部资料的截图。
