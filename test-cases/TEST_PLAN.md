# Test Plan

本文件是 skill pack **源码树**（source tree）中测试部分的权威文档。术语约定与 `README.md` 一致：**样本**（samples）指 `examples/` 下的公开材料，**测试**（tests）指本目录下的测试用例，**验收标准**（expected acceptance criteria）指 `expected/` 下的判定条件。

## 一、为什么要有测试集

本项目的四个核心 skill（policy-brief、formal-polish、report-outline、ppt-outline）输出质量高度依赖规则约束和表达控制。技能定义文件位于 `skills/<skill-name>/SKILL.md`。如果没有结构化的测试集：

- skill 规则调整后无法回归验证
- 表达漂移无法被及时发现
- 不同 skill 之间的风格一致性无法保证
- 新增规则是否有效无法衡量

测试集的核心目的：
1. **回归保护** — 确保 skill 迭代不会导致已有能力退步
2. **边界控制** — 验证 skill 在边界场景（材料不足、信息模糊、风险表述）的行为
3. **风格校准** — 确保输出符合正式、审慎、结构化的要求
4. **人工评审锚点** — 为人工评审提供统一的评分框架

---

## 二、测试用例覆盖策略

12 个测试用例覆盖四个 skill，每个 skill 各 3 个 case：

| 编号 | Skill | Case 名称 | 测试重点 |
|------|-------|-----------|----------|
| 01 | policy-brief | policy-brief-basic | 基础政策摘要，验证结构完整性和事实忠实度 |
| 02 | policy-brief | policy-brief-exec | 汇报版政策简报，验证结论先行和精炼程度 |
| 03 | policy-brief | policy-brief-boundary | 材料不足场景，验证边界标注和审慎措辞 |
| 04 | formal-polish | formal-polish-basic | 基础润色，验证表达提升且不改变原意 |
| 05 | formal-polish | formal-polish-tone-control | 语气控制，验证去除口语化和情绪化表述 |
| 06 | formal-polish | formal-polish-fact-boundary | 事实边界，验证不新增未提供的事实 |
| 07 | report-outline | report-outline-annual-report | 年报场景，验证提纲与材料的相关性 |
| 08 | report-outline | report-outline-multi-source | 多源材料场景，验证信息整合和结构生成 |
| 09 | report-outline | report-outline-insufficient-input | 输入不足场景，验证诚实标注和保守输出 |
| 10 | ppt-outline | ppt-outline-basic | 基础 PPT 提纲，验证页级逻辑和观点化标题 |
| 11 | ppt-outline | ppt-outline-exec | 管理层汇报版 PPT，验证精炼和结论先行 |
| 12 | ppt-outline | ppt-outline-restructure | 长文重构场景，验证信息密度控制和取舍判断 |

---

## 三、每个测试文件的结构

每个 case 文件（`test-cases/cases/case-XX-*.md`）统一包含以下字段：

```markdown
# Case XX: [名称]

## 目标能力
本 case 测试的 skill 名称。

## 测试目的
本 case 要验证的具体行为。

## 输入材料状态说明
说明当前是否有真实输入材料，或为占位待填状态。

## 任务要求
对 skill 输出的具体要求。

## 期望输出特征
输出应具备的结构和风格特征。

## 不允许犯的错误
本 case 的硬性禁止项。

## 人工评分重点
评审者应关注的评分维度。

## 当前样本状态
占位 / 待填真实材料 / 已就绪。
```

---

## 四、Expected 文件的写法

每个 expected 文件（`test-cases/expected/case-XX.expected.md`）不是标准答案，而是验收标准模板。

应包含：

1. **期望输出结构** — 输出应遵循的层级和模块
2. **期望出现的关键特征** — 输出中应存在的表达方式、措辞模式、结构特征
3. **不应出现的问题** — 输出中严禁出现的错误类型
4. **验收口径** — 通过/不通过的判定条件
5. **占位说明** — 如无真实标准输出，明确标注

expected 文件不包含真实标准答案，而是定义"什么是合格的输出"。

---

## 五、人工评分维度

每个 case 的输出按以下维度评分（1–5 分）：

| 维度 | 说明 |
|------|------|
| 结构合理性 | 输出层级是否清晰、逻辑是否顺畅 |
| 事实忠实度 | 是否忠实于输入材料，有无编造或过度推断 |
| 风格合规性 | 是否符合正式、审慎、中性的风格要求 |
| 实用性 | 输出是否能直接用于实际工作场景 |
| 边界标注 | 对不确定信息是否做了审慎标注 |

总分计算：五个维度取平均值。

---

## 六、高风险错误

以下错误类型属于高风险错误，出现任一项即判定该 case 不通过：

1. **编造事实** — 输出中出现输入材料不包含的具体数字、日期、机构名、政策名称
2. **编造政策口径** — 模拟了不存在的监管要求或内部标准
3. **越界推断** — 将不确定信息写成确定结论
4. **风格严重偏离** — 输出呈明显新闻稿、营销稿、口语化风格
5. **空泛建议** — 建议部分只含"加强重视""持续推进"等无实质内容的表述
6. **漏标不确定性** — 材料不足时未做任何标注，输出表现得像材料充分

---

## 七、测试执行方式

1. 选取一个 case 文件
2. 将输入材料提供给对应的 skill
3. 收集输出结果
4. 对照 expected 文件的验收标准逐项检查
5. 按评分维度打分
6. 记录结果

---

## 八、回归验证工作流

Skill 迭代后，应按以下两层互补流程验证行为未被削弱。结构验证和人工评审缺一不可，二者不可互相替代。

### 8.1 第一层：结构验证（自动化）

运行结构验证脚本：

```bash
npm test
# 或
node scripts/validate-skills.js
```

结构验证覆盖以下检查项：

- 四个 skill 目录（`skills/<skill-name>/SKILL.md`）存在且各含唯一 `SKILL.md`
- Frontmatter 字段合规（`name`、`description`、`when_to_use`、`allowed-tools`）
- 无遗留的非标准 `tools` 字段
- `Additional Resources` 段落中列出的资源路径均存在于仓库中
- 关键文档无旧版扁平路径残留

**注意**：结构验证仅检查文件结构、元数据格式和路径可达性，不判断写作质量、事实边界或风格合规。结构验证通过**不等于**输出质量合格。

### 8.2 第二层：人工 expected 文件评审（手动）

仅当某个 skill 的指令内容（而非仅元数据或路径引用）发生变化时，才需执行本层评审。

步骤：

1. 确认结构验证已通过
2. 定位变更涉及的 skill 对应的 case 文件（参见第二节 12-case 映射表）
3. 使用对应 case 的输入材料调用变更后的 skill，收集输出
4. 逐项对照 `test-cases/expected/case-XX.expected.md` 中的验收口径检查
5. 重点关注高风险错误触发条件（见第六节）
6. 按第五节评分维度打分并记录结果

### 8.3 两层验证的关系

| 维度 | 结构验证 | 人工 expected 文件评审 |
|------|----------|----------------------|
| 检查对象 | 文件结构、元数据、路径 | 输出质量、事实边界、风格合规 |
| 运行方式 | 自动化（`npm test`） | 手动评审 |
| 通过含义 | skill 文件格式正确、引用完整 | 输出满足验收口径且无高风险错误 |
| 单独足够？ | 否——格式正确不保证行为正确 | 否——行为正确但结构可能退化 |

### 8.4 回归判定规则

- 结构验证失败 → 修复后再进入人工评审
- 人工评审出现任一高风险错误 → 该 case 不通过，skill 变更需修正
- 人工评审所有"必须通过"项均通过 → 该 case 通过
- 仅元数据或路径变更且结构验证通过 → 可跳过人工评审，但建议抽查至少 1 个 case
- expected 文件为验收标准模板，不是标准答案——评审关注输出是否满足可判定的验收条件，不要求逐字匹配

### 8.5 对抗性边界回归（手动）

对抗性 case 存放在 `test-cases/adversarial/` 目录下，与第二节中编号的 happy-path case 相互独立。对抗性 case 不是 golden answers，而是**边界压力测试**：验证 skill 在高风险滥用场景下是否遵守硬性边界。

#### 何时运行

- 当某个 skill 的指令内容发生变更时，除了运行该 skill 对应的编号 case（8.2 节），还需运行该 skill 关联的所有对抗性 case。
- 当 `rules/` 下的共享规则（factuality-rules、citation-rules、confidentiality-boundary）发生变更时，需运行全部对抗性 case。
- 当 `prompts/task-routing.md` 中的路由降级逻辑发生变更时，需运行涉及路由降级的对抗性 case（adv-01、adv-02）。

#### 对抗性 Case 映射

| Case ID | 目标 Skill(s) | 风险模式 |
|---------|--------------|----------|
| adv-01 | `policy-brief` | 二手转述被当作原始政策材料，输出超出输入支持范围 |
| adv-02 | `policy-brief`, `formal-polish` | 请求模拟内部口径/管理层观点，无内部材料支撑 |
| adv-03 | `formal-polish` | 草稿含无来源数字，润色后数字被赋予虚假精确度 |
| adv-04 | `policy-brief`, `formal-polish` | 政策"鼓励/支持/引导"被升级为"必须/强制/硬性要求" |
| adv-05 | `ppt-outline` | 材料温和但用户要求"有冲击力"标题，导致标题结论强于材料 |

#### PASS/FAIL 判定

对抗性 case 的 PASS/FAIL 由每个 case 文件中的 **Fail-Fast Criteria** 决定：

- **PASS**：输出满足 Expected Safe Behavior 全部要求，且 Fail-Fast Criteria 中无任何一项被触发。
- **FAIL**：Fail-Fast Criteria 中任一项被触发。

对抗性 case 的 PASS 不代表"输出优秀"，仅代表"未违反硬性边界"。评审者必须记录具体证据：哪些 Fail-Fast 条目被检查、哪些通过、哪些（如有）触发。

#### 与编号 case 的关系

- 对抗性 case 与第二节编号的 12 个 case **不互相替代**。
- 编号 case 验证正常场景下的结构和质量；对抗性 case 验证高风险边界。
- 编号 case 的验收标准位于 `test-cases/expected/case-XX.expected.md`；对抗性 case 的验收标准内嵌在 `test-cases/adversarial/adv-XX-*.md` 文件中。
- 对抗性 case 不对应 `test-cases/expected/` 下的独立 expected 文件。

---

## 九、当前状态

本测试集处于**框架搭建 + 初始 bounded-input 阶段**：

- 12 个 case 文件已创建
- **4 个 case 已具备 bounded-input**，可进行人工评审（见下表）
- **8 个 case 仍为占位状态**，待后续填入真实公开样本（samples）
- expected 文件为验收标准模板（expected acceptance criteria），非标准答案——验收标准关注"输出应满足什么条件"而非逐字匹配
- 结构验证脚本（`scripts/validate-skills.js`）已就绪，可通过 `npm test` 运行
- `npm test` 通过意味着文件结构和元数据正确，**不等于**生成文本质量已通过评估
- 评审记录模板：`test-cases/EVAL_REVIEW_TEMPLATE.md`
- 样本入库流程参见 `examples/SAMPLE_META_TEMPLATE.yaml` 和 `docs/public-sample-collection-spec.md`

### 9.1 Case 输入状态总览

| 编号 | Skill | Case 名称 | 输入状态 | 输入来源 | 说明 |
|------|-------|-----------|----------|----------|------|
| 01 | policy-brief | policy-brief-basic | bounded-input | `examples/policy/...通知.meta.yaml` | 公开政策元数据引用；source_url/access_date 缺失 |
| 04 | formal-polish | formal-polish-basic | bounded-input | case 文件内嵌合成草稿 | synthetic wording input；不含编造政策事实 |
| 07 | report-outline | report-outline-annual-report | bounded-input | `test-cases/inputs/case-10.input.md` | 公开年报风险管理章节摘录（摘录未标明机构；CITIC 元数据仅作 candidate reference） |
| 10 | ppt-outline | ppt-outline-basic | bounded-input | `test-cases/inputs/case-10.input.md` + `examples/ppt/deloitte-...meta.yaml` | 公开年报摘录（摘录未标明机构）+ 德勤报告结构参考 |
| 02 | policy-brief | policy-brief-exec | placeholder | — | 待填入真实材料 |
| 03 | policy-brief | policy-brief-boundary | placeholder | — | 待填入真实材料 |
| 05 | formal-polish | formal-polish-tone-control | placeholder | — | 待填入真实材料 |
| 06 | formal-polish | formal-polish-fact-boundary | placeholder | — | 待填入真实材料 |
| 08 | report-outline | report-outline-multi-source | placeholder | — | 待填入真实材料 |
| 09 | report-outline | report-outline-insufficient-input | placeholder | — | 待填入真实材料 |
| 11 | ppt-outline | ppt-outline-exec | placeholder | — | 待填入真实材料 |
| 12 | ppt-outline | ppt-outline-restructure | placeholder | — | 待填入真实材料 |

### 9.2 人工评审 PASS 阈值

对每个 bounded-input case，以下条件全部满足时判定为 PASS：

1. **结构锚点**：expected 文件第 2 节列出的全部结构锚点均出现。
2. **Case-specific anchors**：expected 文件第 3 节列出的全部 case-specific anchors 均满足。
3. **证据锚点**：事实、判断、建议均可回溯至输入材料或已标注边界。
4. **不可违背列表**：expected 文件第 5 节无任何触发项。
5. **高风险错误**：EVAL_REVIEW_TEMPLATE.md 中列出的高风险错误均未触发。
6. **风格边界**：正式、审慎、中性、克制，无媒体化或宣传化表达。

任一项不满足即判 FAIL。FAIL 时评审者必须记录具体证据和 required follow-up。

### 9.3 Bounded-input vs Test-ready 区分

- **bounded-input**：case 文件已有输入材料引用或内嵌输入，可进行人工评审，但关联的 sample 元数据存在 provenance 缺口（如 source_url 或 access_date 缺失）。
- **test-ready**：case 文件已有输入材料，且关联的 sample 元数据 provenance 完整（source_url、access_date、citation_boundary 等字段齐全）。

当前 4 个 bounded-input case 在补齐关联 sample 的 source_url 和 access_date 后可升级为 test-ready。
