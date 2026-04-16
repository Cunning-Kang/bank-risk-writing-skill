# Test Case Notes

## 目录结构

```text
test-cases/
├─ TEST_PLAN.md          # 测试总计划
├─ notes.md              # 本文件
├─ cases/                # 12 个测试用例文件
│  ├─ case-01-policy-brief-basic.md
│  ├─ case-02-policy-brief-exec.md
│  ├─ case-03-policy-brief-boundary.md
│  ├─ case-04-formal-polish-basic.md
│  ├─ case-05-formal-polish-tone-control.md
│  ├─ case-06-formal-polish-fact-boundary.md
│  ├─ case-07-report-outline-annual-report.md
│  ├─ case-08-report-outline-multi-source.md
│  ├─ case-09-report-outline-insufficient-input.md
│  ├─ case-10-ppt-outline-basic.md
│  ├─ case-11-ppt-outline-exec.md
│  └─ case-12-ppt-outline-restructure.md
└─ expected/             # 12 个验收标准模板
   ├─ case-01.expected.md
   ├─ ...
   └─ case-12.expected.md
```

## 测试覆盖

12 个测试用例覆盖四个 skill，每个 skill 3 个 case：

- **policy-brief**：基础摘要、汇报版、材料不足边界
- **formal-polish**：基础润色、语气控制、事实边界
- **report-outline**：年报场景、多源整合、输入不足
- **ppt-outline**：基础提纲、管理层汇报版、长文重构

## 当前状态

大部分 case 的输入材料为占位状态，待填入真实公开样本。
expected 文件为验收标准模板，非标准答案。

详见 `TEST_PLAN.md`。
