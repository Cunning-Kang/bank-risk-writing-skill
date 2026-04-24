# case-07 Expected: report-outline-annual-report

## 1. 适用范围

- 对应用例：`test-cases/cases/case-07-*.md`
- 对应 skill：`skills/report-outline/SKILL.md`
- 文件性质：绝对验收判定规则，不是标准答案；不得据此生成样本正文。
- 判定方式：逐项对照输入材料、skill 输出契约和本文件 anchor；所有“必须通过”项均满足时才可判 PASS。

## 2. Output Contract Anchor

输出必须提供可写作的报告结构，每个层级都对应具体写作任务；不得输出脱离材料的通用框架。

输出必须包含以下结构锚点：
- `推荐标题`
- `核心结论或写作主线`
- `一级提纲`
- `二级展开建议`
- `建议补充材料`

## 3. Case-Specific Anchors

- 提纲必须与年报风险管理章节高度相关。
- 一级标题不得使用通用年报模板章节。
- 二级展开建议必须说明写什么、为什么写、需要什么证据。

## 4. Evidence Anchors

- 每一条事实性表述均应能在输入材料中找到对应依据；找不到依据时必须标注为待核实或需补充来源。
- 每一条分析性判断均不得强于输入材料可支持的程度；如材料不完整，应使用“从当前材料看”“基于现有资料可初步判断”“仍需进一步观察”等审慎表述。
- 每一条建议或关注点均应指向可执行的核对、补充、跟踪、比较或后续分析动作。

## 5. 不可违背列表

出现任一项即判 FAIL：
- 编造输入材料中不存在的事实、数字、日期、机构、文件名称、政策依据或监管口径。
- 将不确定、建议性、倾向性或待观察内容改写为确定结论。
- 模拟内部银行政策、内部审批逻辑、内部风险偏好或未披露机构观点。
- 使用新闻稿、营销稿、宣传稿、情绪化或口号式表达。
- 用“加强重视”“持续推进”“统筹做好”等空泛表述替代具体分析或行动方向。
- 输出与输入材料弱相关的万能框架。
- 只列标题、不说明写作方向、证据需求或边界。
- 为追求完整而添加材料无法支撑的章节或分析维度。

## 6. PASS 自评规则

| 检查项 | 判定要求 | 结果 |
|---|---|---|
| 结构锚点 | 第 2 节列出的全部结构锚点均出现 | PASS / FAIL |
| Case anchor | 第 3 节列出的全部 case-specific anchors 均满足 | PASS / FAIL |
| 证据锚点 | 事实、判断、建议均可回溯或已标注边界 | PASS / FAIL |
| 不可违背列表 | 第 5 节无任何触发项 | PASS / FAIL |
| 风格边界 | 正式、审慎、中性、克制，无媒体化或宣传化表达 | PASS / FAIL |
| 最终结论 | 以上全部为 PASS 时，本 case 才可判 PASS | PASS / FAIL |

## 7. 输入材料引用

- 对应 case 文件：`test-cases/cases/case-07-report-outline-annual-report.md`
- 输入摘录：`test-cases/inputs/case-10.input.md`（包含公开年报风险管理章节 3.5 全文；摘录文件仅标注"公开可用文本"，未标明具体机构）
- 相邻元数据（仅供参考 schema，不证明摘录来源）：`examples/reports/annual-reports/2024-CITIC-bank-annual-report.meta.yaml`
- 输入状态：bounded-input（摘录自身 source_url/access_date 缺失，不标记 test-ready）
- 运行方式：将 test-cases/inputs/case-10.input.md 中的年报风险管理章节摘录作为 report-outline skill 输入，收集输出后按本规则逐项评审

## 8. 当前状态

本文件定义了 case-07 的验收判定规则。case-07 已具备 bounded-input（公开年报风险管理章节摘录），可进行人工评审。摘录来源未被元数据直接证明；当前摘录自身 source_url/access_date 缺失，补齐后可升级为 test-ready。
