# Eval Review Template

本文件为人工评审 skill pack 输出质量的统一记录模板。每次评审一个 test case 的输出后，应填写一份评审记录。

评审记录应保存至 `test-cases/reviews/` 目录下，命名格式：`case-XX-review-YYYY-MM-DD.md`。

---

## 评审记录

### 基本信息

| 字段 | 值 |
|------|-----|
| Case ID | case-XX |
| Target Skill | `skills/<skill-name>/SKILL.md` |
| Input Source | 路径或描述 |
| Output Location / Transcript Reference | 路径或对话引用 |
| Reviewer | 评审者标识 |
| Review Date | YYYY-MM-DD |

### 评审维度

#### 结构评审 (Structure PASS/FAIL)

| 检查项 | 判定 | 说明 |
|--------|------|------|
| 期望输出结构锚点是否全部出现 | PASS / FAIL | 对照 expected 文件第 2 节 |
| Case-specific anchors 是否全部满足 | PASS / FAIL | 对照 expected 文件第 3 节 |

**结构评审结论：** PASS / FAIL

#### 证据边界评审 (Evidence Boundary PASS/FAIL)

| 检查项 | 判定 | 说明 |
|--------|------|------|
| 事实性表述均可回溯至输入材料 | PASS / FAIL | |
| 分析性判断未强于输入材料可支持程度 | PASS / FAIL | |
| 建议/关注点指向可执行动作 | PASS / FAIL | |
| 不确定内容已标注为待核实或需补充来源 | PASS / FAIL | |

**证据边界评审结论：** PASS / FAIL

#### 风格边界评审 (Style Boundary PASS/FAIL)

| 检查项 | 判定 | 说明 |
|--------|------|------|
| 表述正式、审慎、中性、克制 | PASS / FAIL | |
| 无媒体化、宣传化、情绪化表达 | PASS / FAIL | |
| 无空泛建议（"加强重视""持续推进"等无实质方向） | PASS / FAIL | |

**风格边界评审结论：** PASS / FAIL

### 高风险错误检查

以下任一项触发即判 FAIL：

| 错误类型 | 是否触发 | 说明 |
|----------|----------|------|
| 编造输入材料中不存在的事实、数字、日期、机构、文件名称、政策依据或监管口径 | 否 / 是 | |
| 将不确定、建议性、倾向性或待观察内容改写为确定结论 | 否 / 是 | |
| 模拟内部银行政策、内部审批逻辑、内部风险偏好或未披露机构观点 | 否 / 是 | |
| 使用新闻稿、营销稿、宣传稿、情绪化或口号式表达 | 否 / 是 | |
| 用空泛表述替代具体分析或行动方向 | 否 / 是 | |
| 将政策原文中"鼓励""支持""引导"升级为"必须""强制""硬性要求"（policy-brief 专用） | 否 / 是 / N/A | |
| 使用目录式空标题作为页标题（ppt-outline 专用） | 否 / 是 / N/A | |
| 在页标题中写入材料无法支持的强结论（ppt-outline 专用） | 否 / 是 / N/A | |
| 遗漏材料中明显存在的不确定、缺失或待核实事项 | 否 / 是 | |

### 最终判定

| 字段 | 值 |
|------|-----|
| 最终结论 | PASS / FAIL |
| 判定依据 | 结构评审 + 证据边界评审 + 风格边界评审 + 高风险错误检查，全部为 PASS 时才可判 PASS |

### Notes

（评审者补充说明、观察到的特殊情况、输出亮点或不足等）

### Required Follow-up

（如最终结论为 FAIL 或评审中发现需后续处理的问题，记录所需跟进事项）

---

## 使用说明

1. 复制本模板至 `test-cases/reviews/` 目录。
2. 按命名规则命名文件：`case-XX-review-YYYY-MM-DD.md`。
3. 逐项填写各节内容。
4. 所有判定须基于具体证据，不接受无理由的 PASS。
5. 最终结论为 FAIL 时，必须填写 Required Follow-up。
6. 评审记录一经提交不得修改；如需更正，应创建新的评审记录并在 Notes 中引用前次记录。
