# PPT Examples — 公开汇报材料和PPT文字稿样本

## 应该收什么

- 可公开获取的会议发言提纲
- 演讲材料文字部分
- 公开课件文字内容
- 公开发布的专题汇报材料
- 具有页级逻辑结构的汇报文本

## 不应该收什么

- 内部汇报 PPT
- 含有保密信息的演示材料
- 仅含图表无文字内容的 PPT
- 未经授权的会议记录
- 来源不明的汇报稿

## 建议命名方式

```
YYYY-source-type-topic-shortname.md
```

示例：
- `2026-conference-briefing-risk-trends-outline.md`
- `2025-seminar-presentation-regulatory-update.md`

对应元信息文件：
- `2026-conference-briefing-risk-trends-outline.meta.yaml`

## 建议 metadata 写法

```yaml
source_type: ppt
collection_reason:
  - ppt-sample           # 学习PPT页级逻辑
  - structure-sample     # 学习汇报结构
tags:
  - ppt
  - briefing
usable_for:
  - ppt-outline
```

## 主要服务 skill

| Skill | 用途 |
|-------|------|
| ppt-outline | PPT 页级提纲生成的风格参考和逻辑学习 |

## 目录结构建议

```text
ppt/
├─ raw/          # 原始提取的PPT文字内容
├─ extracted/    # 清洗后的结构化内容
└─ notes/        # 样本说明和备注
```

## 正样本与负样本

### 正样本

- 页标题观点化、逻辑清晰的汇报材料
- 每页聚焦一个核心信息、支撑点简洁的材料
- 适合学习页间逻辑和信息密度控制的材料

### 负样本

- 每页标题仅为目录式命名（如"背景介绍""风险分析"）
- 长段文字直接堆砌在页面上的材料
- 每页承载过多信息（超过 7 个支撑点）

负样本入库时需在 `risk_flags` 中标记 `unclear-structure`，并标注 `quality_score ≤ 2`。
