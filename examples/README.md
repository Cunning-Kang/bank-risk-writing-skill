# Examples — 公开样本库

本目录用于存放项目所用的公开样本（samples），包括政策原文、银行披露材料、研究报告、PPT 汇报材料和改写对照案例。

所有样本必须来自公开来源，且经过筛选和元信息标注后方可入库。样本是 skill pack **源码树**（source tree）的一部分，与 `skills/`、`rules/`、`templates/`、`glossary/`、`checklists/`、`test-cases/` 共同构成完整的 skill pack。

---

## 目录结构

```text
examples/
├─ SAMPLE_META_TEMPLATE.yaml   # 元信息模板（每个样本必须填写）
├─ README.md                   # 本文件
├─ policy/                     # 政策与监管原文样本
├─ reports/                    # 公开披露材料和研究报告样本
├─ ppt/                        # 公开汇报材料和PPT文字稿样本
└─ rewrite-cases/              # 改写前后对照案例
```

---

## 如何使用元信息模板

每次新增样本时，必须同步创建一个 `.meta.yaml` 文件。

### 步骤

1. 复制 `SAMPLE_META_TEMPLATE.yaml`，重命名为与样本文件同名的 `.meta.yaml` 文件。
   - 例如样本为 `2025-nfra-policy-capital-management.md`，则元信息文件为 `2025-nfra-policy-capital-management.meta.yaml`

2. 填写以下必填字段：
   - `title` — 样本标题
   - `source_type` — 来源类型
   - `source_name` — 来源机构
   - `public_confirmed` — 必须为 `true`
   - `collection_reason` — 收集原因（至少一项）
   - `quality_score` — 质量评分（1–5）
   - `usable_for` — 适用于哪些 skill（至少一项）
   - `notes` — 必须说明适合学什么、不适合学什么

3. 补充以下来源溯源字段（test-ready 样本必填，其他样本建议填写）：
   - `source_url` — 原始公开来源 URL 或获取渠道说明
   - `access_date` — 获取/访问日期（YYYY-MM-DD）
   - `source_version` — 来源版本或文件日期（如政策修正版年份、年报年度）
   - `archive_note` — 归档说明（链接可能失效时说明替代方式）
   - `citation_boundary` — 引用边界（必填：明确该样本在引用时的限制）
   - `can_quote_directly` — 是否可直接引用原文（默认 false）
   - `provenance_note` — 溯源补充说明（无 source_url 时建议填写）

4. 建议补充以下增强字段：
   - `recommended_uses` — 说明该样本最适合支持哪些任务
   - `not_suitable_for` — 说明不应从该样本学习什么
   - `used_in_tests` / `linked_test_cases` — 标记是否已进入测试集

5. 检查 `risk_flags`，如有风险标记则如实填写。

### 字段说明

| 字段 | 是否必填 | 说明 |
|------|---------|------|
| title | 必填 | 简明描述材料内容 |
| source_type | 必填 | 只能选 policy / annual-report / quarterly-report / research / ppt / briefing / rewrite-case / other |
| source_name | 必填 | 来源机构或平台名称 |
| public_confirmed | 必填 | 必须为 true 才能入库 |
| collection_reason | 必填 | 至少一项 |
| quality_score | 必填 | 1–5 分 |
| risk_flags | 必填 | 无风险写 `[none]` |
| tags | 选填 | 自由标签，便于检索 |
| usable_for | 必填 | 至少一项 skill |
| recommended_uses | 建议填写 | 最适合支持的任务或测试方式 |
| not_suitable_for | 建议填写 | 明确提醒不要误学的部分 |
| notes | 必填 | 必须说明适用与不适用场景 |
| source_url | test-ready 必填 | 原始公开来源 URL 或获取渠道说明 |
| access_date | 建议填写 | 获取/访问日期（YYYY-MM-DD） |
| source_version | 建议填写 | 来源版本或文件日期 |
| archive_note | 选填 | 归档说明（链接可能失效时说明替代方式） |
| citation_boundary | 必填 | 引用时的限制——不可超出来源材料范围 |
| can_quote_directly | 必填 | 是否可直接引用原文（默认 false） |
| provenance_note | 无 source_url 时建议填写 | 溯源补充说明 |
| used_in_tests | 选填 | 是否已被测试集使用 |
| linked_test_cases | 选填 | 关联的 case 编号 |

---

## 样本入库的最低判断标准

一个样本只有同时满足以下条件，才建议入库：

1. **公开性明确**：可以确认来源公开、可追溯。
2. **用途明确**：知道它是拿来学风格、学结构、做测试，还是做反例。
3. **边界明确**：知道它适合学什么、不适合学什么。
4. **质量可评估**：能够给出 1–5 分质量评分。
5. **风险可标注**：如果有宣传腔、结构混乱、OCR 问题等，必须如实标出。

如果只能确认“可公开”，但无法说明使用边界，该样本不应直接进入高质量样本池。

---

## 什么样的样本不应入库

以下情况的样本不得进入本目录：

- **非公开材料**：内部文件、审批稿、保密材料、限制传播文本
- **来源不明**：无法追溯到明确公开来源的材料
- **质量过低**：OCR 错乱严重、结构混乱、信息密度极低
- **宣传腔/营销腔**：明显以宣传、营销为目的的文本（除非作为负样本）
- **过时失效**：已被新政策明确取代且不再具有参考价值的旧政策（除非用于对比研究，并在 notes 中说明）
- **未填写元信息**：缺少 `.meta.yaml` 的样本视为未入库

---

## 命名规范

统一格式：`YYYY-source-type-topic-shortname.md`

- 年份在前
- 来源类型明确
- 主题简短
- 文件名可读
- 不使用中文空格

详见 `docs/public-sample-collection-spec.md`。

---

## 建议的样本使用方式

### 用于 skill 优化
- 先选高质量正样本，明确该样本支持哪个 skill、哪类输出
- 再选少量负样本，提醒模型避免宣传腔、目录式标题、过强结论等问题

### 用于测试集（tests）
- 优先选择 `quality_score >= 4` 且 `public_confirmed: true` 的样本
- 一份样本进入测试集前，至少补齐 `recommended_uses` 和 `not_suitable_for`
- 如果样本风险较高但仍要测试，应在 `risk_flags` 与 `notes` 中同时写清楚
- 测试用例和验收标准（expected acceptance criteria）定义在 `test-cases/` 目录下，详见 `test-cases/TEST_PLAN.md`
- 验收标准是判定输出是否合格的条件，不是标准答案——不要求逐字匹配

## `quality_score` 的建议口径

为减少评分主观性，建议按以下锚点打分：

- 5 分：公开性明确，结构/风格质量都很强，适用边界清楚，可直接作为高质量正样本
- 4 分：整体质量好，适合作为正样本，只有少量局部瑕疵
- 3 分：基本可用，但存在结构、风格或说明层面的明显不足，需要谨慎使用
- 2 分：问题较明显，只建议作为负样本或待修订样本
- 1 分：不建议入库，除非专门保留为反例

### 用于 few-shot 对照
- 优先选边界清晰、结构稳定、适合迁移的样本
- 避免把权威性不足、宣传色彩较重的材料当作「标准写法」

---

## 样本来源溯源与引用边界（Provenance & Citation Boundary）

### `quality_score` 仅衡量用途价值

`quality_score` 评估的是该样本对 skill pack 的**结构、风格和表达参考价值**，不代表：
- 该样本具有监管权威性或可作为监管依据
- 样本中的数据或判断可外推至来源材料以外的范围
- 样本可替代对原始文件的核验

### 两层溯源规则

**第一层：test-ready 样本（`used_in_tests: true`）**

用于测试集的样本必须具备完整的溯源信息：
- `source_url` 或等效的 `provenance_note` 说明获取渠道
- `access_date`、`source_version` 或 `document_date`
- `citation_boundary` 明确引用限制
- `can_quote_directly` 明确是否可逐字引用
- `linked_test_cases` 非空且指向已存在的 case 文件

**第二层：style/structure-only 样本**

仅用于风格或结构参考的样本：
- 必须有 `citation_boundary`
- 必须有 `source_name` 和来源类型说明
- 如果没有 `source_url`，必须有 `provenance_note` 说明获取渠道
- 须标记为 `not test-ready`（即 `used_in_tests: false`）
- 不要求全部溯源字段完整，但来源边界和引用限制必须明确

### 按类型的引用边界要求

| 样本类型 | 引用边界 |
|---------|---------|
| 政策/监管原文 | 仅限该版本该条文的结构与表述参考；须核对最新正式文本；不代表当前生效版本 |
| 年报/披露材料 | 仅支持对该机构已披露材料的分析；不得外推至全行业、其他机构或未披露信息 |
| 咨询/研究报告 | 仅作结构或表达参考；非监管依据；结论不具有监管权威性 |
| PPT/汇报材料 | 仅作页级逻辑和观点化标题参考；非监管或权威依据 |
| 改写对照样本 | 仅作改写前后对照；原始材料须遵守其各自类型的引用边界 |
