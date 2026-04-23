# Rewrite Cases — 改写前后对照案例

## 应该收什么

- 基于公开材料人工构造的“改写前后对照”案例
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
usable_for:
  - policy-brief
rewrite_goal: 将政策原文改写为正式政策简报
quality_score: 4
risk_flags:
  - none
must_preserve:
  - 不新增原文未出现的监管要求
  - 保留条款边界
rewrite_actions:
  - 政策条文压缩为简报要点
  - 区分事实与影响判断
risk_notes: 原文部分实施细节未写明，输出中应标注待核实
```

## 主要服务 skill

| Skill | 用途 |
|-------|------|
| policy-brief | 政策摘要的 few-shot 参考 |
| formal-polish | 润色的 before/after 对照 |
| report-outline | 报告提纲的结构参考 |
| ppt-outline | PPT 提纲的逻辑参考 |

## 案例最少应说明的三件事

每组改写案例至少要让后续使用者看清：

1. **原文是什么问题**：输入是口语化、条文密集、结构散，还是信息过载。
2. **改写做了什么**：是正式化、压缩、重组，还是提炼。
3. **哪些不能改**：哪些事实、边界、结论强度绝不能动。

如果这三件事说不清，该案例不适合做 few-shot 或测试参考。

## 评分建议

为降低不同标注者的评分漂移，可按以下口径给 `quality_score`：

- 5 分：边界清晰、改写质量高、说明完整，适合直接做 few-shot 或高优先测试样本
- 4 分：整体可靠，存在少量局部可改进处，但不影响作为正样本使用
- 3 分：可参考，但说明或输出仍有明显欠缺，更适合一般测试而非强示范样本
- 2 分：存在边界不清、改写偏移、结构较弱等问题，仅建议作负样本或修订后再用
- 1 分：不建议直接使用，除非专门作为反例保留

## 正样本与负样本

### 正样本

- 改写后保持了原意且表达质量明显提升
- 改写过程可控，改写说明清晰
- 能明确说明“改了什么”和“没改什么”
- 适合作为 few-shot 参考的案例

### 负样本

- 改写后偏离原意
- 改写中引入了非公开信息
- 改写后风格仍不合规（仍有媒体腔、情绪化等）
- 改写说明缺失或不清晰

负样本入库时需在 `risk_flags` 中标记具体问题，标注 `quality_score ≤ 2`。
