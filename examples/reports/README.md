# Report Examples — 公开披露材料和研究报告样本

## 应该收什么

- 银行公开年报 / 半年报 / 季报中的风险管理相关章节
- ESG 报告、社会责任报告中的相关内容
- 公开研究报告（券商研报、行业研究、咨询机构报告）
- 管理层讨论与分析（MD&A）相关章节
- 公开专题研究材料

## 不应该收什么

- 内部研究报告或内部调研数据
- 未公开的同业分析材料
- 保密或限制传播的分析报告
- 仅含图表而文字不可读的材料
- 来源不明或无法验证公开性的材料

## 建议命名方式

```
YYYY-source-type-topic-shortname.md
```

示例：
- `2024-abc-bank-annual-report-risk-management.md`
- `2025-broker-research-real-estate-exposure.md`
- `2025-industry-report-regulatory-trends.md`

对应元信息文件：
- `2024-abc-bank-annual-report-risk-management.meta.yaml`

## 建议 metadata 写法

```yaml
source_type: annual-report    # 或 research / quarterly-report
collection_reason:
  - style-sample         # 学习正式披露表达
  - structure-sample     # 学习报告结构
tags:
  - annual-report
  - risk-disclosure
usable_for:
  - report-outline
  - ppt-outline
  - formal-polish
```

## 主要服务 skill

| Skill | 用途 |
|-------|------|
| report-outline | 报告提纲生成的输入材料 |
| ppt-outline | 汇报 PPT 的输入材料 |
| formal-polish | 正式表达风格的学习参考 |

## 目录结构建议

```text
reports/
├─ annual-reports/    # 年报/半年报/季报相关章节
├─ research/          # 公开研究报告
└─ notes/             # 样本说明和备注
```

## 正样本与负样本

### 正样本

- 年报风险管理章节中结构清晰、表述审慎的材料
- 研究报告中分析框架明确、结论与数据对应的材料
- 适合学习正式披露表达和风险分析结构的材料

### 负样本

- 券商研报中明显带有荐股倾向的"研究报告"
- 报告中结论远超数据支撑的部分
- 宣传色彩重的"行业白皮书"或"蓝皮书"

负样本入库时需在 `risk_flags` 中标记 `over-confident-conclusion` 或 `promotional-tone`。
