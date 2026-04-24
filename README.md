# Bank Risk & Policy Writing Skill Pack

一个面向**银行风险管理 / 政策研究 / 正式汇报 / PPT 提纲化**场景的公开资料写作辅助项目骨架。本仓库是一个 Claude Code skill pack 源码树，为 Claude Code 提供结构化的写作技能定义。

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

本项目是一个 Claude Code skill pack 源码树，用于向 Claude Code 注入写作技能定义。它不假设对任何特定银行的内部写作标准、审批流程或术语体系的了解。

它最合适的定位是：

> 基于公开资料的正式写作、结构化分析与汇报辅助系统。
