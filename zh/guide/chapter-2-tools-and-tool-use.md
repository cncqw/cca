# 第 2 章：工具与 `tool_use`

> 文档：[Tool Use](https://platform.claude.com/docs/en/build-with-claude/tool-use)

## 2.1 什么是 `tool_use`

`tool_use` 是允许 Claude 调用外部函数的机制。模型不直接运行代码——它生成结构化的工具调用请求；您的代码执行它并返回结果。

## 2.2 工具定义

每个工具使用 JSON 模式定义：

```json
{
  "name": "get_customer",
  "description": "通过邮箱或 ID 查找客户。返回客户档案，包括姓名、邮箱、订单历史和账户状态。使用此工具之前请先于 lookup_order 前验证客户身份。接受邮箱（格式：user@domain.com）或数字 customer_id。",
  "input_schema": {
    "type": "object",
    "properties": {
      "email": {"type": "string", "description": "客户邮箱"},
      "customer_id": {"type": "integer", "description": "数字客户 ID"}
    },
    "required": []
  }
}
```

**工具描述的关键要素：**

1. **描述是主要选择机制。** LLM 根据工具描述选择工具。最简描述（"获取客户信息"）在工具重叠时会导致错误。

2. **描述中应包含：**
   - 工具的功能和返回内容
   - 输入格式和示例值
   - 边缘情况和约束
   - 何时使用此工具而非类似替代品

3. **避免** 跨工具使用相同或重叠的描述。如果 `analyze_content` 和 `analyze_document` 描述几乎相同，模型会混淆它们。

4. **内置工具与 MCP 工具：** 代理可能更偏好内置工具（Read、Grep）而非功能类似的 MCP 工具。为防止这种情况，需强化 MCP 工具描述——突出内置工具无法提供的具体优势、独特数据或上下文。

## 2.3 `tool_choice` 参数

`tool_choice` 控制模型如何选择工具：

| 值 | 行为 | 使用时机 |
|---|---|---|
| `{"type": "auto"}` | 模型决定是否调用工具或用文本回答 | 大多数情况的默认值 |
| `{"type": "any"}` | 模型**必须**调用某个工具 | 需要保证结构化输出时 |
| `{"type": "tool", "name": "extract_metadata"}` | 模型**必须**调用特定工具 | 需要强制第一步/执行顺序时 |

**重要场景：**
- `tool_choice: "any"` + 多个提取工具 → 模型选择最佳工具，但仍能获得结构化输出
- 强制选择 → 需要保证特定首个操作（例如，在丰富之前执行 `extract_metadata`）

## 2.4 结构化输出的 JSON 模式

使用带 JSON 模式的 `tool_use` 是从 Claude 获取结构化输出的**最可靠**方式。它：
- 保证语法上有效的 JSON（无缺失括号，无尾随逗号）
- 强制执行所需结构（必填字段存在）
- **不**保证语义正确性（值仍可能是错误的）

**模式设计 — 关键原则：**

```json
{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "enum": ["bug", "feature", "docs", "unclear", "other"]
    },
    "category_detail": {
      "type": ["string", "null"],
      "description": "category = 'other' 或 'unclear' 时的详情"
    },
    "severity": {
      "type": "string",
      "enum": ["critical", "high", "medium", "low"]
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1
    },
    "optional_field": {
      "type": ["string", "null"],
      "description": "如果在源中未找到信息则为 Null"
    }
  },
  "required": ["category", "severity"]
}
```

**模式设计规则：**
1. **必填与可选：** 仅当信息始终可用时才将字段标记为必填。必填字段会促使模型在数据缺失时捏造值。
2. **可空字段：** 对可能缺失的信息使用 `"type": ["string", "null"]`。模型可以返回 `null` 而非产生幻觉。
3. **含 `"other"` 的枚举：** 添加 `"other"` + 详情字符串，避免丢失预定义类别之外的数据。
4. **枚举 `"unclear"`：** 用于模型无法自信选择类别的情况——诚实的 `"unclear"` 优于错误的类别。

## 2.5 语法错误与语义错误

| 错误类型 | 示例 | 缓解措施 |
|---|---|---|
| **语法** | 无效 JSON，字段类型错误 | 使用 JSON 模式的 `tool_use`（可消除） |
| **语义** | 合计不符，值在错误字段中，幻觉 | 验证检查，带反馈的重试，自我纠正 |

---

