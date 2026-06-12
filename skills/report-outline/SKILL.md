---
name: report-outline
description: 基于公开资料、已有摘要或草稿，生成适合研究、分析或正式汇报场景使用的结构化报告提纲
when_to_use:
  - 用户需要从公开资料、政策文本、年报章节或草稿生成报告大纲或结构化提纲
  - 用户要求搭建可写作的报告框架而非仅做语言润色
  - 用户提到"报告提纲""研究框架""汇报稿结构""帮我搭个大纲"等意图
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Purpose

你负责将用户提供的公开资料、政策材料、年报章节、研究摘要或初步草稿，转化为结构清晰、层级合理、便于后续写作的报告提纲。

你的职责是：
- 搭建真正可写的结构，而不是拼出“万能框架”
- 保证提纲与输入材料高度相关
- 让每一级标题都对应明确写作任务
- 帮用户识别哪些内容可写、哪些内容仍需补证据

# When to Use

适用于以下场景：
- 从公开资料整理报告大纲
- 从政策文本生成研究结构
- 从年报/季报章节生成分析提纲
- 从多个材料生成汇报稿框架
- 将已有草稿重构为更合理的提纲

不适用于：
- 用户只需要语言润色而非结构重组时
- 输入材料极少，只能产出一句话摘要时
- 需要直接写成完整报告正文时

# Trigger Conditions

Invoke this skill when the user asks to build a report outline, research framework, analytical structure, briefing structure, or writing framework from public materials, excerpts, annual report sections, policy materials, research notes, or an existing draft.

Use this skill when the request includes signals such as:
- 报告提纲、研究框架、汇报稿结构、搭个大纲、写作框架
- 基于年报、政策文本、公开材料或多份材料生成结构化报告框架
- 重构草稿结构，使其更适合研究、分析或正式汇报

Do not use this skill when:
- the user only needs sentence-level polishing
- the user asks for a policy brief rather than a report-writing framework
- the user asks for page-level PPT structure
- the task requires writing a full report body rather than an outline
- the requested framework would require inventing missing facts, data, or internal institutional standards

When multiple skills could apply, choose this skill only if the primary deliverable is a report-level structure rather than a summary or slide deck.

# Required Inputs

尽量识别：
- 原始材料或材料摘要
- 报告用途：研究 / 汇报 / 简报 / 比较分析 / 观察点评
- 受众对象：自己整理 / 部门汇报 / 领导阅读 / PPT 前置
- 篇幅要求：短 / 中 / 长
- 风格偏向：研究型 / 汇报型 / 结论先行型

若用户未说明，默认：
- 先给推荐标题和写作主线
- 以 4–6 个一级部分控制主体结构
- 二级提纲只展开关键写作任务，不做空泛铺陈

# Input Schema

Required input:
- `source_material`: public material, annual report section, policy excerpt, research summary, user draft, or multiple source excerpts.

Optional input:
- `report_use`: research / briefing / memo / comparative analysis / observation note.
- `audience`: self-use / department briefing / leadership reading / PPT preparation.
- `length`: short / medium / long, or expected section depth.
- `style`: research-oriented / briefing-oriented / conclusion-first.
- `source_count`: single-source / multi-source; include source labels if provided.

Defaults when omitted:
- provide a recommended title and writing thesis.
- use 4–6 primary sections for the main outline.
- expand only the writing tasks that the material can support.

Insufficient input handling:
- If the material is too thin for a complete outline, label the output as an initial framework and identify missing evidence or materials.
- For multi-source input, preserve source distinctions where needed and mark conflicts or gaps rather than forcing a single conclusion.

# Working Method

按以下顺序组织：
1. 先判断输入是否需要报告提纲；若更适合做正式润色、政策摘要或 PPT 页级提纲，应先指出
2. 判断材料核心问题是什么、能支撑到什么结论强度
3. 再决定提纲是按“背景—内容—影响—建议”还是按“问题—分析—判断—行动”展开
4. 每一部分都说明“写什么”“为什么写”“需要什么证据”
5. 若材料不足，只输出初步框架，并列出缺口
6. 多材料输入时，围绕同一主线整合，避免按来源逐份堆叠

# Default Output Structure

🔴 CHECKPOINT · 默认一级提纲控制在 4–6 节。若材料不足以支撑 4 节，缩减而非注水。不得超过 6 节，除非用户明确要求且材料充足。

## 1. 推荐标题
- 标题应明确主题和任务对象，不空泛

## 2. 核心结论或写作主线
- 用 1–3 句说明全文围绕什么逻辑展开

## 3. 一级提纲
- 列出主要章节，并说明各章作用
- 每节必须对应一个写作任务，而非一个抽象分类标签

## 4. 二级展开建议
对每个一级部分，优先说明：
- 本节要回答什么问题
- 建议写哪些要点
- 哪些事实、数据或对照最关键
- 哪些地方要注意边界或审慎表述

## 5. 建议补充材料
- 指出要写得更扎实，最好补哪些公开证据、数据、对照材料或政策原文

若材料明显不足，应在开头直接说明“以下为基于现有材料形成的初步框架”。

# Output Contract

The output must include:
1. 推荐标题
2. 核心结论或写作主线
3. 一级提纲
4. 二级展开建议
5. 建议补充材料

Mandatory quality constraints:
- The outline must be derived from the input material, not from a generic template.
- Each primary section must have a clear writing task and logical order.
- Secondary expansion must say what to write, why it matters, and what evidence is needed.
- Multi-source outlines must integrate by theme rather than listing source A / source B mechanically.
- Insufficient-input cases must remain conservative and avoid complete-looking but unsupported frameworks.

Self-check anchor:
- Every section title and secondary writing task must be explainable from the supplied material or explicitly marked as needing additional evidence.

# Core Rules

1. 提纲必须来自输入材料，而非脱离材料的套模板输出
2. 结构必须服务于写作任务，而不是形式上的完整
3. 一级标题要有逻辑顺序，不能互相重复
4. 二级内容必须能指导实际写作，而不是空标签
5. 当材料不足时，应明确指出提纲只能做到初步框架
6. 不要为了显得系统而堆砌无意义章节

# Preferred Structural Logic

## 政策研究类
- 背景
- 核心内容
- 关键变化
- 影响分析
- 风险/关注点
- 后续观察

## 风险分析类
- 问题概述
- 主要风险点
- 成因分析
- 影响判断
- 建议措施
- 持续跟踪点

## 同业观察类
- 披露特征
- 核心发现
- 风险变化
- 管理动作
- 可参考点与局限

## 汇报类
- 总体结论
- 关键支撑
- 主要问题
- 建议动作

# Boundary Handling

当输入材料不足以支持完整结构时：
- 可以给出”初步提纲”
- 必须写明缺少哪些关键材料
- 不能把待补证据的部分写成确定内容
- 如存在多种可行结构，优先选与用户用途最匹配的一种，并说明主线

# Failure Modes

| 触发条件 | 一线修复 | 仍失败兜底 |
|---|---|---|
| 输入只有一句话（如”帮我搭个大纲”） | 输出保守初始框架 + 列出材料缺口清单 | 告知用户至少需要一份材料摘要才能产出可用提纲 |
| 材料极薄，不足以支撑多节结构 | 生成 2–3 节最小框架，每节标注”需补充证据” | 只给推荐标题 + 写作主线 + 材料需求清单 |
| 多材料来源相互矛盾 | 保留矛盾、标记出处差异，不强行统一 | 按主题分别列出两版要点，交用户判断 |
| 用户指定结构但材料无法支撑 | 先说明材料缺口，再按用户结构给出可写部分 | 🔴 STOP · 告知用户当前材料不足以支撑该结构，建议先补充材料 |

🔴 CHECKPOINT · 输出提纲前，若材料明显不足，必须显式标注”以下为初步框架”并列出材料缺口，不得以完整提纲形态呈现。

🔴 CHECKPOINT · 当存在多种可行结构时，先给出推荐结构及理由，再展开。不默认选最长或最”系统”的方案。

# Hard Rules

1. 不得编造原材料中不存在的事实、数据、政策要求或结论
2. 不得输出与输入材料弱相关的空泛大纲
3. 不得只列标题，不说明写作方向
4. 不得用“加强重视、持续推进”等空话充当章节内容
5. 不得把不确定判断写成确定结论

# Final Self-Check

输出前确认：
- 一级结构是否形成清晰主线
- 二级展开是否能直接指导写作
- 是否避免了空泛、脱离材料的章节
- 对材料缺口是否有明确提示
- 是否没有新增材料中不存在的事实和强结论

# Additional Resources

Shared rules:
- `rules/factuality-rules.md` — factuality constraints and uncertainty labeling
- `rules/citation-rules.md` — citation and source handling requirements
- `rules/confidentiality-boundary.md` — public-material boundary and internal-policy prohibition
- `rules/writing-principles.md` — ordering, structure, and style principles
- `rules/tone-and-style.md` — target tone and expressions to avoid
- `rules/banned-and-caution-phrases.md` — prohibited and caution expressions with recommended alternatives

Templates:
- `templates/risk-report-template.md` — risk report structure template
- `templates/exec-summary-template.md` — executive summary structure template

Glossary (optional expression guidance; do not treat as a factual source):
- `glossary/preferred-expressions.yml` — recommended formal and cautious expressions

Review checklist:
- `checklists/report-review-checklist.md` — self-check items for report outline output

Acceptance references:
- `test-cases/TEST_PLAN.md` — test plan covering skill acceptance criteria
- `test-cases/cases/case-07-report-outline-annual-report.md`
- `test-cases/cases/case-08-report-outline-multi-source.md`
- `test-cases/cases/case-09-report-outline-insufficient-input.md`
- `test-cases/expected/case-07.expected.md`
- `test-cases/expected/case-08.expected.md`
- `test-cases/expected/case-09.expected.md`

Project-level writing rules:
- `CLAUDE.md`
