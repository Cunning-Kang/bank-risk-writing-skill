# Examples — 公开样本库

本目录用于存放项目所用的公开样本，包括政策原文、银行披露材料、研究报告、PPT 汇报材料和改写对照案例。

所有样本必须来自公开来源，且经过筛选和元信息标注后方可入库。

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

3. 检查 `risk_flags`，如有风险标记则如实填写。

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
| notes | 必填 | 必须说明适用与不适用场景 |

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
