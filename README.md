# Bank Risk & Policy Writing Skill Pack

一个面向**银行风险管理 / 政策研究 / 正式汇报 / PPT 提纲化**场景的公开资料写作辅助项目骨架。本仓库是一个 Claude Code skill pack **源码树**（source tree），为 Claude Code 提供结构化的写作技能定义。它不是独立的可安装包——当前可直接在 Claude Code 中引用本仓库目录使用，但未来打包分发需要将共享资源一并纳入（见下方"Skill Pack 的有效范围"）。

本项目的目标不是模拟任何银行内部制度口径或内部审稿偏好，也不是内部政策模拟器（internal policy emulator），而是基于：

- 公开政策与监管文件
- 银行公开披露材料
- 公开研究报告
- 用户明确提供的文本材料

帮助完成以下任务：

- 政策解读
- 正式润色
- 报告提纲生成
- PPT 页级提纲生成
- 基础审稿与表达质量控制

**硬性边界：本项目只使用公开材料或用户明确提供的材料。不模拟任何银行的内部政策、内部审批偏好或内部术语标准。输出不等于任何机构的正式立场。**

## Quick Start

### 1. 了解四个核心 Skill

| Skill | 入口文件 | 适用场景 |
|-------|---------|---------|
| policy-brief | `skills/policy-brief/SKILL.md` | 从政策原文生成结构化简报 |
| formal-polish | `skills/formal-polish/SKILL.md` | 将草稿润色为正式、审慎的表达 |
| report-outline | `skills/report-outline/SKILL.md` | 从材料生成报告提纲 |
| ppt-outline | `skills/ppt-outline/SKILL.md` | 从材料生成页级 PPT 提纲 |

每个 skill 的入口文件包含触发条件、输入要求、工作方法、输出规范和硬性规则。

### 2. 选择 Skill

根据任务类型选择对应 skill。如果任务涉及多阶段（如先做政策简报再转 PPT 提纲）、混合意图（如润色加结构调整、年报转汇报 PPT）、材料不足（如只有二手转述），参见 `prompts/task-routing.md` 的路由规则和降级行为。如果用户请求涉及内部口径或非公开信息，应明确拒绝并说明本项目只基于公开材料。

**路由摘要**（完整规则见 `prompts/task-routing.md`）：

- 单一意图：直接匹配对应 skill。
- 混合意图：按"先提炼事实 → 再生成提纲 → 最后润色或 PPT 化"顺序组合。
- 材料不足（无原文/链接）：降级输出"材料整理边界与需补证据清单"，不做完整解读。
- 涉及内部口径（"结合我行情况""按管理层口径"）：不得模拟内部观点，只基于公开材料整理并明确标注边界。
- 管理层汇报版：结论先行、待核实事项不省略、不因受众而强化结论。

### 3. 运行结构验证

```bash
npm test
# 等同于
node scripts/validate-skills.js
```

这会检查 skill 目录结构、frontmatter 元数据、资源路径可达性，以及文档中无遗留的旧版路径。

### 4. 理解验证覆盖范围

`npm test` 通过意味着文件结构和元数据格式正确，**不意味着**生成文本的质量、事实边界或风格合规已经被评估。写作质量的验证需要人工按照 `test-cases/TEST_PLAN.md` 的两层流程执行。

### 5. Source Tree 与 Installable Bundle 的区别

当前仓库是 skill pack **源码树**。要获得完整的写作辅助能力，只复制 `skills/` 目录是不够的——skill 文件通过 `Additional Resources` 引用了共享资源（见下方说明）。未来如需打包分发，必须将共享资源一并纳入。

## Skill Pack 的有效范围

一个完整可用的 skill pack 不仅包含 `skills/` 目录，还依赖以下共享资源：

| 目录 | 作用 | 被引用方式 |
|------|------|-----------|
| `rules/` | 写作、事实核查、引用、风格、保密边界与禁用表达规则 | 各 skill 的 `Additional Resources` |
| `templates/` | 常见文稿结构模板 | 各 skill 的 `Additional Resources` |
| `glossary/` | 术语、推荐表达和弱表达替换规则 | 各 skill 的 `Additional Resources` |
| `checklists/` | 输出后的审稿自检 | 各 skill 的 `Additional Resources` |

**单独复制 `skills/` 不完整。** 任何打包或分发操作必须包含上述目录，否则 skill 引用的资源路径将无法解析。

## 添加第一个可用样本

向项目中添加新的公开样本的最小流程：

1. 将样本文件放入 `examples/` 下对应子目录（`policy/`、`reports/`、`ppt/`、`rewrite-cases/`）。
2. 按命名规范命名：`YYYY-source-type-topic-shortname.md`（详见 `docs/public-sample-collection-spec.md`）。
3. 复制 `examples/SAMPLE_META_TEMPLATE.yaml`，创建同名 `.meta.yaml` 文件并填写必填字段。
4. 确认 `public_confirmed: true`，并如实填写 `quality_score`、`usable_for`、`notes`。
5. 如果样本将用于测试集，补充 `used_in_tests: true` 和 `linked_test_cases`，并参照 `test-cases/TEST_PLAN.md` 确认验收标准。

## 设计原则

1. **只用公开材料**，不依赖任何内部文档。
2. **先事实，后判断，最后建议**。
3. **不编造政策、数字、出处、内部口径**。
4. **强调正式、审慎、结构化表达**。
5. **先把高频任务做稳，再扩展能力**。

## 目录结构

```text
bank-risk-writing-skill/
├─ README.md
├─ CLAUDE.md
├─ docs/
│  └─ public-sample-collection-spec.md
├─ skills/
│  ├─ policy-brief/
│  │  └─ SKILL.md
│  ├─ formal-polish/
│  │  └─ SKILL.md
│  ├─ report-outline/
│  │  └─ SKILL.md
│  └─ ppt-outline/
│     └─ SKILL.md
├─ rules/
│  ├─ writing-principles.md
│  ├─ factuality-rules.md
│  ├─ citation-rules.md
│  ├─ tone-and-style.md
│  ├─ confidentiality-boundary.md
│  └─ banned-and-caution-phrases.md
├─ templates/
│  ├─ policy-analysis-template.md
│  ├─ risk-report-template.md
│  ├─ exec-summary-template.md
│  └─ ppt-outline-template.md
├─ glossary/
│  ├─ financial-terms.yml
│  ├─ regulatory-terms.yml
│  ├─ preferred-expressions.yml
│  └─ weak-expressions-to-rewrite.yml
├─ examples/
│  ├─ README.md
│  ├─ SAMPLE_META_TEMPLATE.yaml
│  ├─ policy/
│  ├─ reports/
│  ├─ ppt/
│  └─ rewrite-cases/
│     ├─ _template/           # 改写对照案例模板
│     └─ README.md
├─ checklists/
│  ├─ report-review-checklist.md
│  ├─ policy-review-checklist.md
│  └─ ppt-review-checklist.md
├─ test-cases/
│  ├─ TEST_PLAN.md
│  ├─ notes.md
│  ├─ cases/                  # 12 个测试用例
│  └─ expected/               # 12 个验收标准模板
└─ prompts/
   ├─ input-template.md
   └─ task-routing.md
```

## 推荐使用顺序

### 第一阶段：先跑通两个最有价值的能力

建议优先测试：
- `skills/formal-polish/SKILL.md`
- `skills/ppt-outline/SKILL.md`

因为这两个最容易快速产生实际收益。

### 第二阶段：补规则和表达库

重点维护：
- `rules/banned-and-caution-phrases.md`
- `glossary/preferred-expressions.yml`
- `templates/ppt-outline-template.md`

### 第三阶段：建立对照样本与测试集

建议用公开样本做以下测试：
- 政策原文 → 政策简报
- 年报风险章节 → 报告提纲
- 粗糙草稿 → 正式润色稿
- 长文 → PPT 提纲

## 文件说明

### `CLAUDE.md`
项目总约束文件，定义边界、事实规则、风格要求、输出原则和硬性禁止项。

### `docs/`
项目规范文档。`public-sample-collection-spec.md` 定义了公开样本的收集、筛选、命名、评分、清洗和入库规则。

### `skills/`
存放四个核心能力的技能目录。每个技能位于独立子目录 `skills/<skill-name>/SKILL.md` 中，包含 frontmatter 元数据、能力描述、规则引用和补充资源链接。四个技能为：policy-brief、formal-polish、report-outline、ppt-outline。

### `rules/`
存放写作、事实核查、引用、风格、保密边界与禁用表达规则。

### `templates/`
存放常见文稿结构模板，帮助模型输出更稳定。

### `glossary/`
存放术语、推荐表达和弱表达替换规则。

### `examples/`
用于沉淀公开样本和优质改稿对照案例。`SAMPLE_META_TEMPLATE.yaml` 是所有样本的元信息模板。每个子目录（policy/ reports/ ppt/ rewrite-cases/）有独立的 README 说明收集规范。`rewrite-cases/_template/` 提供了新建改写对照案例时可直接复制的模板文件。

### `checklists/`
用于输出后的审稿自检。

### `test-cases/`
用于回归测试。`TEST_PLAN.md` 是测试总计划。`cases/` 下有 12 个独立测试用例文件，覆盖四个 skill 的基础、进阶和边界场景。`expected/` 下有对应的验收标准模板——注意这些是验收标准而非标准答案，用于判定输出是否合格而非与固定文本逐字比对。目前大部分 case 的输入材料为占位状态，待填入真实公开样本。

### `prompts/`
用于统一任务输入格式与路由逻辑。

## 当前 Readiness 状态

| 维度 | 状态 | 说明 |
|------|------|------|
| 文件结构与元数据 | 已验证 | `npm test` 覆盖 skill 目录、frontmatter、资源路径可达性 |
| 共享资源引用 | 已验证 | 各 skill 的 `Additional Resources` 路径可达 |
| 样本来源溯源 | 框架就绪，待逐样本补充 | 元信息模板已定义，现有样本需补全溯源字段（见 U2） |
| 测试输入与验收 | 框架就绪，大部分为占位 | 12 个 case 框架已建立，大部分输入材料待填入真实公开样本 |
| 写作质量评估 | 未自动化 | 写作质量、事实边界、风格合规需人工按 `test-cases/TEST_PLAN.md` 评审 |
| 打包分发 | 未完成 | 当前为源码树，未来需将共享资源一并纳入打包流程 |

**`npm test` 通过 = 结构和元数据正确，不等于生成文本质量已通过评估。**

## 后续最值得补的内容

1. 一批公开材料的高质量 few-shot 样本
2. 更多术语库与推荐表达
3. 任务路由规则
4. 更细化的测试用例
5. 针对不同输出对象的风格层

## 不要误用本项目

本项目不是：
- 内部制度模拟器（internal policy emulator）
- 终稿自动生成器
- 政策事实自动认证器
- 内部审稿规则替代品

本项目是一个 Claude Code skill pack **源码树**（source tree），用于向 Claude Code 注入写作技能定义。它不假设对任何特定银行的内部写作标准、审批流程或术语体系的了解。

术语约定：
- **源码树**（source tree）：当前仓库状态，包含 skills、共享资源、样本、测试和文档。
- **样本**（samples）：`examples/` 目录下的公开材料，用于风格学习、结构参考和测试输入。
- **测试**（tests）：`test-cases/` 下的测试用例和验收标准模板。
- **验收标准**（expected acceptance criteria）：`test-cases/expected/` 下的文件，定义输出应满足什么条件，不是标准答案。

它最合适的定位是：

> 基于公开资料的正式写作、结构化分析与汇报辅助系统。
