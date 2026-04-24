---
name: ppt-outline
description: 将报告、长文、政策解读或研究摘要转换为适合正式汇报场景使用的 PPT 页级提纲
when_to_use:
  - 用户需要将报告、长文、政策解读或研究摘要转为页级 PPT 汇报提纲
  - 用户要求输出带页标题、支撑点和页面逻辑的演示结构而非普通报告大纲
  - 用户提到"做 PPT""PPT 提纲""转汇报页""演示结构""页级提纲"等意图
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Purpose

你负责将用户提供的报告、长文、政策解读结果、年报摘要或分析材料，转换为适合 PPT 汇报的页级结构。

你的职责是：
- 提炼主线，而不是压缩原文段落
- 设计页间逻辑，而不是罗列目录标题
- 让每页标题尽量观点化
- 控制每页信息密度，避免“文字墙”
- 明确哪些内容适合上屏，哪些更适合放备注栏或口头说明

PPT 不是把报告缩短，而是把主线讲清。

# When to Use

适用于以下场景：
- 报告转 PPT
- 摘要转汇报页提纲
- 政策解读转演示结构
- 研究材料转管理层汇报提纲
- 长文压缩为 5–10 页左右的表达框架

不适用于：
- 用户只需要报告提纲、不需要页级表达时
- 原始材料极少、尚不足以支撑多页汇报时
- 需要直接产出完整演讲稿或页面文案时

# Trigger Conditions

Invoke this skill when the user asks to convert a report, long text, policy interpretation, annual report excerpt, research summary, or analysis material into a page-level PPT outline for formal briefing or presentation.

Use this skill when the request includes signals such as:
- 做 PPT、PPT 提纲、转汇报页、演示结构、页级提纲
- 将报告、长文、政策解读或研究材料压缩为 3–10 页左右的汇报结构
- 需要每页标题、支撑点、本页作用、备注建议或口头摘要

Do not use this skill when:
- the user needs a report outline rather than slide-level structure
- the user only needs language polishing
- the user asks for a policy brief rather than a presentation structure
- the material is too limited to support multiple slides unless the output is explicitly framed as an initial sketch
- the requested output would require inventing unsupported facts, numbers, conclusions, or internal institutional views

When the user asks for “汇报版” or “领导汇报”, prioritize conclusion-first sequencing and reduce page count.

# Required Inputs

尽量识别：
- 原始材料
- 汇报对象：自己整理 / 同事沟通 / 部门汇报 / 领导汇报
- 目标页数：如 5 页 / 8 页 / 10 页
- 风格偏向：稳健 / 结论先行 / 分析型 / 执行型
- 是否需要附口头说明提要

若用户未说明，默认：
- 按 5–8 页控制
- 优先采用“结论/判断 → 支撑 → 风险/影响 → 建议/关注点”的顺序
- 以正式、审慎、可讲述为优先

# Input Schema

Required input:
- `source_material`: report, long text, policy summary, annual report excerpt, research note, or analytical material to convert.

Optional input:
- `audience`: self-use / colleague discussion / department briefing / leadership briefing.
- `page_count`: target page range or exact page count.
- `style`: prudent / conclusion-first / analytical / execution-oriented.
- `include_speaker_notes`: yes / no.
- `include_one_minute_summary`: yes / no.

Defaults when omitted:
- use 5–8 pages.
- sequence as conclusion or judgment → support → risks or impacts → recommendations or follow-up items.
- prioritize formal, prudent, speakable slide logic.

Insufficient input handling:
- If the material cannot support the requested page count, reduce scope or mark the outline as an initial sketch.
- Uncertain or unsupported content must be reflected in conservative page titles and notes.

# Working Method

按以下顺序组织：
1. 先判断输入是否适合做页级汇报；若更适合报告提纲、正式润色或政策摘要，应先指出
2. 识别材料主问题、主结论、主支撑
3. 判断哪些信息必须上屏，哪些只适合备注栏或口头补充
4. 将内容压缩为页级信息，而非段落搬运
5. 为每页设置单一核心信息
6. 保证页间衔接自然，避免跳跃或重复

# Default Output Structure

## 1. 建议总标题
- 标题应能概括整份汇报的主题与结论方向

## 2. 汇报主线
- 用 2–4 句话说明整份 PPT 的讲述逻辑

## 3. 页级提纲
每页包含：
- 页标题（尽量观点化）
- 本页核心信息（1 句，可选但推荐）
- 3–5 个支撑点
- 本页作用：背景 / 判断 / 对比 / 影响 / 风险 / 建议 / 总结
- 备注栏建议（如有）

## 4. 不建议上 PPT 的内容
- 列出更适合放备注栏、附件或口头说明的内容

## 5. 可选：1 分钟口头摘要
- 仅在用户有汇报需求时提供

# Output Contract

The output must include:
1. 建议总标题
2. 汇报主线
3. 页级提纲
4. 不建议上 PPT 的内容
5. 可选：1 分钟口头摘要（仅在用户有汇报需求时提供）

Each page in the page-level outline must include:
- 页标题（尽量观点化）
- 本页核心信息（1 句，可选但推荐）
- 3–5 个支撑点
- 本页作用
- 备注栏建议（如有）

Mandatory quality constraints:
- One page should carry one core message.
- Page titles should follow the `ppt_titles` patterns in `glossary/preferred-expressions.yml` and avoid directory-style labels.
- Long source paragraphs, excessive numerical detail, definitions, and method notes should be moved to notes or the “不建议上 PPT” section.
- Page titles and support points must not express conclusions stronger than the source material supports.
- The outline must prioritize speakability and information selection over comprehensive text compression.

Self-check anchor:
- Each slide must have a traceable source basis, a single core message, and no more than 3–5 support points unless the user explicitly requests otherwise.

# Page-Level Rules

1. 一页尽量只承载一个核心信息
2. 每页支撑点控制在 3–5 个，且尽量为一行短句
3. 不把长段原文直接搬上页面
4. 同一层级页面的表达密度应基本一致
5. 若材料无法支撑强判断，标题和要点都要保守
6. 同类信息不要拆散到多页造成重复

# Title Guidance

页标题优先参考 `glossary/preferred-expressions.yml` 中 `ppt_titles` 类表达模式，
确保标题尽量观点化，而非目录式命名。

`ppt_titles.preferred` 是观点化标题句式参考；应根据输入材料重新组织，不得机械套用。
`ppt_titles.avoid` 是目录式标题禁用清单；除非用户明确要求保留目录式结构，否则不得作为页标题使用。

# What Belongs in Notes Instead of Slides

下列内容优先放备注栏或口头说明，而不是上屏：
- 过长的政策条文原文
- 需要连续解释的背景细节
- 过多数字明细、补充口径、定义说明
- 证据来源、样本口径、方法说明
- 不足以支撑标题、但值得提醒的限制条件

# Page Logic Preference

默认页序逻辑：
1. 总体判断 / 结论
2. 背景与变化
3. 核心观察或支撑
4. 主要影响或风险
5. 建议动作 / 后续关注
6. 总结页（可选）

如用户指定受众为管理层，优先采用：
- 结论先行
- 支撑从少到精
- 建议与关注点单独成页或并入结尾页

# Hard Rules

1. 不得编造原材料中不存在的事实、数据、机构、政策依据
2. 不得使用目录式空标题替代观点化标题
3. 不得让单页出现明显“文字墙”
4. 不得为追求完整而牺牲可讲述性
5. 不得在标题中给出材料无法支持的强结论

# Final Self-Check

输出前确认：
- 页标题是否大多为观点化表达，而非目录名
- 是否每页只有一个核心信息
- 是否每页支撑点控制在 3–5 个
- 是否明确列出了不建议上屏的内容
- 是否存在把不确定内容写成强结论的情况

# Additional Resources

Shared rules:
- `rules/factuality-rules.md` — factuality constraints and uncertainty labeling
- `rules/citation-rules.md` — citation and source handling requirements
- `rules/confidentiality-boundary.md` — public-material boundary and internal-policy prohibition
- `rules/writing-principles.md` — ordering, structure, and style principles
- `rules/tone-and-style.md` — target tone and expressions to avoid
- `rules/banned-and-caution-phrases.md` — prohibited and caution expressions with recommended alternatives

Templates:
- `templates/ppt-outline-template.md` — PPT page-level outline structure template

Glossary (optional expression guidance; do not treat as a factual source):
- `glossary/preferred-expressions.yml` — recommended formal and cautious expressions (see ppt_titles category for title patterns)

Review checklist:
- `checklists/ppt-review-checklist.md` — self-check items for PPT outline output

Acceptance references:
- `test-cases/TEST_PLAN.md` — test plan covering skill acceptance criteria
- `test-cases/cases/case-10-ppt-outline-basic.md`
- `test-cases/cases/case-11-ppt-outline-exec.md`
- `test-cases/cases/case-12-ppt-outline-restructure.md`
- `test-cases/expected/case-10.expected.md`
- `test-cases/expected/case-11.expected.md`
- `test-cases/expected/case-12.expected.md`

Project-level writing rules:
- `CLAUDE.md`
