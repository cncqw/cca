# 附录：技术和概念

| 技术 | 关键方面 |
|---|---|
| **Claude Agent SDK** | AgentDefinition、代理循环、`stop_reason`、钩子（PostToolUse）、通过Task生成子代理、`allowedTools` |
| **模型上下文协议（MCP）** | MCP服务器、工具、资源、`isError`、工具描述、`.mcp.json`、环境变量 |
| **Claude Code** | CLAUDE.md层次结构、带glob模式的 `.claude/rules/`、`.claude/commands/`、带SKILL.md的 `.claude/skills/`、规划模式、`/compact`、`--resume`、`fork_session` |
| **Claude Code CLI** | 非交互模式的 `-p` / `--print`、`--output-format json`、`--json-schema` |
| **Claude API** | 带JSON Schema的 `tool_use`、`tool_choice`（"auto"/"any"/强制）、`stop_reason`、`max_tokens`、系统提示词 |
| **Message Batches API** | 50%节省、最长24小时窗口、`custom_id`、不支持多轮工具调用 |
| **JSON Schema** | 必填vs可选、可空字段、枚举类型、"其他"+详情、严格模式 |
| **Pydantic** | Schema验证、语义错误、验证/重试循环 |
| **内置工具** | Read、Write、Edit、Bash、Grep、Glob——目的和选择标准 |
| **少样本提示词** | 模糊情况的针对性示例、对新模式的泛化 |
| **提示词链** | 顺序分解为聚焦检查 |
| **上下文窗口** | 令牌预算、渐进摘要、"中间迷失"、草稿文件 |
| **会话管理** | 恢复、`fork_session`、命名会话、上下文隔离 |
| **置信度校准** | 字段级评分、标注集校准、分层抽样 |

---

