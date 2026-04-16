# Policy Examples — 政策与监管原文样本

## 应该收什么

- 公开政策原文（通知、办法、指引、实施细则等）
- 监管机构公开文件
- 官方解读 / 答记者问
- 正式公告

## 不应该收什么

- 内部政策文件
- 未公开的征求意见稿
- 保密或限制传播的文件
- 媒体对政策的转述或评论（应归入 reports/ 或 rewrite-cases/）
- 来源不明的政策摘要

## 建议命名方式

```
YYYY-source-type-topic-shortname.md
```

示例：
- `2026-nfra-notice-capital-management.md`
- `2025-pbc-guidance-liquidity-risk.md`
- `2025-nfra-q-and-a-loan-classification.md`

对应元信息文件：
- `2026-nfra-notice-capital-management.meta.yaml`

## 建议 metadata 写法

```yaml
source_type: policy
collection_reason:
  - structure-sample    # 政策结构学习
  - test-sample         # 测试用例输入
tags:
  - policy
  - regulation
usable_for:
  - policy-brief
  - report-outline
```

## 主要服务 skill

| Skill | 用途 |
|-------|------|
| policy-brief | 政策摘要生成的输入材料 |
| report-outline | 政策研究提纲的输入材料 |
| ppt-outline | 政策汇报 PPT 的输入材料 |

## 正样本与负样本

### 正样本

- 结构清晰、条款明确的正式通知或办法
- 官方解读中有明确要点拆分的材料
- 适合学习政策解读结构和正式表达的材料

### 负样本

- 文风宣传化的"政策宣传稿"（可用于提醒模型避免的风格）
- 结构混乱、无法提炼要点的材料（标注 quality_score ≤ 2）
- 媒体转述中大量加入主观评论的材料

负样本入库时需在 `risk_flags` 中标记 `promotional-tone` 或 `unclear-structure`。
