# Rewrite Cases — 改写前后对照案例

## 应该收什么

- 基于公开材料人工构造的"改写前后对照"案例
- 原始公开材料摘要 → 正式简报版
- 年报章节 → 风险分析提纲
- 政策原文 → 领导汇报版摘要
- 口语草稿 → 正式文稿
- 长文 → PPT 提纲

## 不应该收什么

- 内部材料改写案例（含内部原始稿或内部定稿）
- 无法确认原始材料为公开来源的改写
- 改写过程中引入了非公开信息的案例
- 没有对照价值的纯输出样本（缺少 input）

## 建议命名方式

每组改写对照放在独立子目录中：

```text
rewrite-cases/
├─ _template/                    # 模板文件（新建对照案例时复制使用）
├─ policy-to-brief/              # 政策原文 → 简报
├─ report-to-outline/            # 报告 → 提纲
├─ text-to-ppt/                  # 长文 → PPT 提纲
└─ polish-cases/                 # 草稿 → 正式文稿
```

每组案例包含：
- `input.md` — 改写前文本
- `output.md` — 改写后文本
- `notes.md` — 改写说明
- `meta.yaml` — 元信息

## 建议 metadata 写法

```yaml
case_name: policy-to-brief-capital-management
source_type: rewrite-case
source_origin: 公开政策原文（标注具体来源）
public_confirmed: true
target_skill: policy-brief
rewrite_goal: 将政策原文改写为正式政策简报
risk_notes: 改写过程中未引入原文不包含的信息
```

## 主要服务 skill

| Skill | 用途 |
|-------|------|
| policy-brief | 政策摘要的 few-shot 参考 |
| formal-polish | 润色的 before/after 对照 |
| report-outline | 报告提纲的结构参考 |
| ppt-outline | PPT 提纲的逻辑参考 |

## 正样本与负样本

### 正样本

- 改写后保持了原意且表达质量明显提升
- 改写过程可控，改写说明清晰
- 适合作为 few-shot 参考的案例

### 负样本

- 改写后偏离原意
- 改写中引入了非公开信息
- 改写后风格仍不合规（仍有媒体腔、情绪化等）
- 改写说明缺失或不清晰

负样本入库时需在 `risk_flags` 中标记具体问题，标注 `quality_score ≤ 2`。
