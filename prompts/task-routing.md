# Task Routing

## 若用户要：

- 解读政策 / 监管文件 → `skills/policy-brief/SKILL.md`
- 润色已有草稿 → `skills/formal-polish/SKILL.md`
- 生成报告大纲 → `skills/report-outline/SKILL.md`
- 报告转 PPT → `skills/ppt-outline/SKILL.md`

## 路由冲突处理

当用户请求的描述可能匹配多个 skill 时，按以下规则消歧：

| 用户意图关键词 | 路由到 | 说明 |
|---------------|--------|------|
| 政策理解 / 政策解读 / 监管文件分析 | policy-brief | 提取政策要点，输出结构化简报 |
| 语言润色 / 表达优化 / 正式化改写 | formal-polish | 保持原意，提升表达质量 |
| 报告结构 / 报告提纲 / 年报框架 | report-outline | 基于材料生成层级化提纲 |
| PPT / 幻灯片 / 逐页提纲 / 页级转化 | ppt-outline | 将内容转化为逐页 PPT 提纲 |
| 政策文件 → PPT（组合任务） | 先 policy-brief，再 ppt-outline | 先提炼事实与结构，再做 PPT 化转化；两个阶段之间保持事实边界，不引入原文不含的信息 |

## 若任务同时包含多个目标

优先顺序建议：

1. 先提炼事实和结构（policy-brief 或 report-outline）
2. 再生成提纲（report-outline 或 ppt-outline）
3. 最后做润色或 PPT 化（formal-polish 或 ppt-outline）

组合任务中，每个阶段应使用对应 skill 的规则。跨阶段传递时保持事实忠实度，不因格式转换而增减信息。
