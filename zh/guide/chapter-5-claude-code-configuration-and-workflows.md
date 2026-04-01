# 第 5 章：Claude Code — 配置与工作流

> 文档：[Claude Code](https://code.claude.com/docs/en/overview) | [内存 / CLAUDE.md](https://code.claude.com/docs/en/memory) | [技能](https://code.claude.com/docs/en/skills) | [MCP](https://code.claude.com/docs/en/mcp) | [钩子](https://code.claude.com/docs/en/hooks) | [子智能体](https://code.claude.com/docs/en/sub-agents) | [GitHub Actions](https://code.claude.com/docs/en/github-actions) | [无头模式](https://code.claude.com/docs/en/headless)

## 5.1 CLAUDE.md 层级结构

CLAUDE.md 是 Claude Code 的指令文件。它有三个层级：

```
1. 用户级：~/.claude/CLAUDE.md
   - 仅适用于该用户
   - 不通过版本控制共享
   - 个人偏好和工作风格

2. 项目级：.claude/CLAUDE.md 或根目录 CLAUDE.md
   - 适用于所有项目贡献者
   - 通过版本控制管理
   - 编码标准、测试标准、架构决策

3. 目录级：子目录中的 CLAUDE.md
   - 在处理该目录中的文件时适用
   - 特定于代码库该部分的约定
```

**常见错误：** 新团队成员未能收到项目指令，因为这些指令被放在了 `~/.claude/CLAUDE.md`（用户级）而非 `.claude/CLAUDE.md`（项目级）。

## 5.2 `@path` 语法（文件导入）

CLAUDE.md 可以使用 `@path` 引用外部文件，使配置模块化：

```markdown
# 项目 CLAUDE.md

编码标准详见 @./standards/coding-style.md
测试要求详见 @./standards/testing-requirements.md
项目概述详见 @README.md，依赖项详见 @package.json
```

**`@path` 规则：**
- 在文件路径前紧跟 `@`（无空格）
- 支持相对路径和绝对路径
- 相对路径相对于包含导入的文件进行解析
- 最大导入嵌套深度为 5

这避免了重复，并使每个包只包含相关标准。

## 5.3 `.claude/rules/` 目录

`.claude/rules/` 是整体式 CLAUDE.md 的替代方案，用于按主题组织规则：

```
.claude/rules/
  testing.md          -- 测试约定
  api-conventions.md  -- API 约定
  deployment.md       -- 部署规则
  react-patterns.md   -- React 模式
```

**关键特性：带 `paths` 的 YAML 前置元数据用于条件加载：**

```yaml
---
paths: ["src/api/**/*"]
---

对于 API 文件，使用带有显式错误处理的 async/await。
每个端点必须返回标准响应包装器。
```

```yaml
---
paths: ["**/*.test.tsx", "**/*.test.ts"]
---

测试必须使用 describe/it 块。
使用数据工厂而非硬编码。
不要模拟数据库——使用测试数据库。
```

**工作原理：**
- 规则**仅**在 Claude Code 编辑与 `paths` 模式匹配的文件时加载
- 这节省了上下文和令牌——不相关的规则不会被加载
- Glob 模式让您可以按文件类型应用约定，而与位置无关（非常适合分散在整个代码库中的测试）

**何时使用带 `paths` 的 `.claude/rules/` 与目录级 CLAUDE.md：**
- 带 `paths` 的 `.claude/rules/` — 当约定适用于分散在多个目录中的文件时（测试、迁移）
- 目录级 CLAUDE.md — 当约定与特定目录绑定且在其他地方不需要时

## 5.4 自定义斜杠命令与技能

> **注意：** 在当前 Claude Code 版本中，自定义命令（`.claude/commands/`）与技能（`.claude/skills/`）已统一。两种格式都会创建 `/名称` 命令。考试指南引用了 `.claude/commands/` — 该格式仍受支持。

斜杠命令是通过 `/名称` 调用的可复用提示模板：

**`.claude/commands/` 格式（旧版，仍受支持）：**

```
.claude/commands/
  review.md        -- /review -- 标准代码审查
  test-gen.md      -- /test-gen -- 测试生成
```

**`.claude/skills/` 格式（当前）：**

```
.claude/skills/
  review/SKILL.md  -- /review -- 带前置元数据配置
  test-gen/SKILL.md
```

**项目命令**（`.claude/commands/` 或 `.claude/skills/`）：
- 存储在版本控制中，克隆仓库时对所有人可用
- 确保团队内工作流的一致性

**用户命令**（`~/.claude/commands/` 或 `~/.claude/skills/`）：
- 不通过版本控制共享的个人命令
- 用于个人工作流

## 5.5 技能 — `.claude/skills/`

技能是通过 SKILL.md 前置元数据配置的高级命令：

```yaml
---
context: fork
allowed-tools: ["Read", "Grep", "Glob"]
argument-hint: "要分析的目录路径"
---

分析指定目录中的代码结构。
输出关于依赖关系和架构模式的报告。
```

**前置元数据参数：**

| 参数 | 说明 |
|---|---|
| `context: fork` | 在隔离的子智能体中运行技能。详细输出不会污染主会话 |
| `allowed-tools` | 限制可用的工具（安全性——例如，如果未被允许，技能无法删除文件） |
| `argument-hint` | 在不带参数调用时提示输入参数的提示语 |

**何时使用技能与 CLAUDE.md：**
- **技能** — 按需调用以完成特定任务（审查、分析、生成）
- **CLAUDE.md** — 始终加载的通用标准和约定

**个人技能（`~/.claude/skills/`）：**
- 以不同名称创建个人变体，不影响队友

## 5.6 规划模式与直接执行

**规划模式：**
- 模型仅进行调查和规划；不进行更改
- 使用 Read、Grep、Glob 探索代码库
- 生成供用户审批的实施计划
- 安全探索，无副作用

**何时使用规划模式：**
- 大规模更改（数十个文件）
- 存在多种可行方案（微服务：如何定义边界？）
- 架构决策（选择哪个框架？什么结构？）
- 不熟悉的代码库（更改前必须先理解）
- 影响 45 个以上文件的库迁移

**何时使用直接执行：**
- 有明确堆栈跟踪的单文件修复
- 添加一个验证检查
- 已充分理解、无歧义的更改

**组合方法：**
1. 使用规划模式进行调查和设计
2. 用户审批计划
3. 使用直接执行实施已审批的计划

**探索子智能体** — 用于探索代码库的专用子智能体：
- 将详细输出与主上下文隔离
- 仅返回摘要
- 防止多阶段任务中上下文窗口耗尽

## 5.7 `/compact` 命令

`/compact` 是用于压缩上下文的内置命令：
- 汇总先前的历史记录以释放上下文窗口
- 用于上下文被大量工具输出填满的长时间调查会话
- 风险：精确的数值、日期和具体细节可能在汇总过程中丢失

## 5.8 `/memory` 命令

`/memory` 是用于管理会话间内存的内置命令：
- 打开 `CLAUDE.md` 文件进行编辑，允许您保存笔记、偏好设置和上下文
- 信息在会话间持久保存，并在启动时自动加载
- 适用于存储项目约定、用户偏好、常用命令和当前工作上下文
- 无需在每个会话中重复说明相同指令的替代方案

## 5.9 用于 CI/CD 的 Claude Code CLI

**`-p`（或 `--print`）标志：**

```bash
claude -p "Analyze this pull request for security issues"
```

- 非交互式模式：处理提示，打印到标准输出，然后退出
- 不等待用户输入
- 在 CI/CD 管道中运行 Claude 的唯一正确方式

**用于 CI 的结构化输出：**

```bash
claude -p "Review this PR" --output-format json --json-schema '{"type":"object",...}'
```

- `--output-format json` — 以 JSON 格式输出
- `--json-schema` — 根据模式验证输出
- 结果可被解析以自动发布内联 PR 评论

**会话上下文隔离：**
生成代码的同一 Claude 会话在审查该代码时通常效果较差（模型保留了其推理上下文，不太可能质疑自己的决策）。使用独立实例进行审查。

**防止重复评论：**
在新提交后重新审查时，将之前的审查结果包含在上下文中，并指示 Claude 仅报告新问题或未解决的问题。

