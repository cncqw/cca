# 第 1 章：Claude API — 模型交互基础

> 文档：[Messages API](https://platform.claude.com/docs/en/api/messages) | [提示工程](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

## 1.1 API 请求结构

Claude API 遵循请求-响应模型。对 Claude Messages API 的每个请求包含：

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 1024,
  "system": "你是一个有帮助的助手。",
  "messages": [
    {"role": "user", "content": "你好！"},
    {"role": "assistant", "content": "你好！"},
    {"role": "user", "content": "你好吗？"}
  ],
  "tools": [...],
  "tool_choice": {"type": "auto"}
}
```

**关键字段：**
- `model` — 模型选择（`claude-opus-4-6`、`claude-sonnet-4-6`、`claude-haiku-4-5`）
- `max_tokens` — 响应中的最大令牌数
- `system` — 系统提示（定义模型行为）
- `messages` — 对话历史（**必须发送完整历史**以保持连贯性）
- `tools` — 可用工具的定义
- `tool_choice` — 工具选择策略

## 1.2 消息角色

`messages` 数组使用三种角色：
- `user` — 用户消息
- `assistant` — 模型响应（发送历史时包含）
- `tool` — 工具调用结果（角色未明确设置；以 `tool_result` 内容块的形式出现）

**至关重要：** 每次 API 请求都必须发送**完整的对话历史**。模型不会在请求之间保持状态——每次调用都是独立的。

## 1.3 响应中的 `stop_reason` 字段

Claude API 响应包含 `stop_reason`，表示模型停止生成的原因：

| 值 | 描述 | 操作 |
|---|---|---|
| `"end_turn"` | 模型完成了响应 | 向用户显示结果 |
| `"tool_use"` | 模型想要调用工具 | 执行工具并返回结果 |
| `"max_tokens"` | 达到令牌限制 | 响应被截断；可能需要增加限制 |
| `"stop_sequence"` | 遇到停止序列 | 根据应用程序逻辑处理 |

对于代理系统，`"tool_use"` 和 `"end_turn"` 最为重要——它们控制代理循环。

## 1.4 系统提示

系统提示是定义上下文和行为规则的特殊指令。它：
- 不是 `messages` 数组的一部分；通过 `system` 字段单独传递
- 优先于用户消息
- 一次加载，在整个对话中有效
- 用于定义角色、约束和输出格式

**考试重点：** 系统提示的措辞可能创建意外的工具关联。例如，"始终验证客户"之类的指令可能导致模型过度使用 `get_customer`，即使在不必要的时候。

## 1.5 上下文窗口

上下文窗口是模型一次可以处理的文本总量（以令牌为单位）。它包括：
- 系统提示
- 完整的消息历史
- 工具定义
- 工具结果

**主要上下文窗口问题：**

1. **中间丢失效应：** 模型可靠地处理长输入开头和结尾的信息，但可能遗漏中间的细节。缓解方法：将关键信息放在开头或结尾附近。

2. **工具结果积累：** 每次工具调用都会将输出添加到上下文中。如果工具返回 40 多个字段但只需要 5 个，大部分上下文就被浪费了。

3. **渐进式摘要：** 压缩历史时，数值、百分比和日期往往丢失，变成模糊的表达（"大约"、"差不多"、"几个"）。

---

