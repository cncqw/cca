# 第 3 章：Claude Agent SDK — 构建智能体系统

> 文档：[Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview) | [Hooks](https://platform.claude.com/docs/en/agent-sdk/hooks) | [Subagents](https://platform.claude.com/docs/en/agent-sdk/subagents) | [Sessions](https://platform.claude.com/docs/en/agent-sdk/sessions)

## 3.1 什么是智能体循环

智能体循环是自主任务执行的核心模式。模型不只是回答——它执行一系列操作：

```
1. 向 Claude 发送带工具的请求
2. 接收响应
3. 检查 stop_reason：
   - "tool_use" -> 执行工具，将结果追加到历史，返回步骤 1
   - "end_turn" -> 任务完成，向用户显示结果
4. 重复直到完成
```

**这是模型驱动的方法：** Claude 根据上下文和先前的工具结果决定下一个要调用的工具。这与动作顺序固定的硬编码决策树不同。

**反模式（避免）：**
- 解析助手文本以检测完成（"任务已完成"）
- 使用任意迭代限制（例如 `max_iterations=5`）作为主要停止条件
- 检查助手是否产生文本内容作为完成信号

**正确方法：** 唯一可靠的完成信号是 `stop_reason == "end_turn"`。

## 3.2 `AgentDefinition` 配置

`AgentDefinition` 是 Claude Agent SDK 中的智能体配置对象：

```python
agent = AgentDefinition(
    name="customer_support",
    description="处理客户的退货和订单问题",
    system_prompt="你是一个客户支持智能体...",
    allowed_tools=["get_customer", "lookup_order", "process_refund", "escalate_to_human"],
    # 对于协调智能体：
    # allowed_tools=["Task", "get_customer", ...]
)
```

**关键参数：**
- `name` / `description` — 智能体的标识和描述
- `system_prompt` — 带指令的系统提示
- `allowed_tools` — 允许的工具列表（最小权限原则）

## 3.3 轮辐式：协调智能体与子智能体

多智能体架构通常构建为轮辐式拓扑：

```
         协调智能体
        /     |      \
   子智能体1  子智能体2  子智能体3
   （搜索）  （分析）  （综合）
```

**协调智能体负责：**
- 将任务分解为子任务
- 决定需要哪些子智能体（动态选择）
- 将工作委派给子智能体
- 聚合和验证结果
- 处理错误和重试
- 向用户传达结果

**关键原则：子智能体有隔离的上下文。**
- 子智能体**不会**自动继承协调智能体的对话历史
- 所有必需的上下文必须在子智能体提示中**显式传递**
- 子智能体不在调用之间共享内存
- 所有通信通过协调智能体流动（用于可观察性和错误控制）

## 3.4 用于生成子智能体的 `Task` 工具

子智能体通过 `Task` 工具生成：

```python
# 协调智能体的 allowedTools 必须包含 "Task"
coordinator_agent = AgentDefinition(
    allowed_tools=["Task", "get_customer"]
)
```

**显式上下文传递是强制性的：**

```
# 不好：子智能体没有上下文
Task: "分析文档"

# 好：提示中包含完整上下文
Task: "分析以下文档。
文档：[完整文档文本]
先前搜索结果：[网络搜索结果]
输出格式要求：[模式]"
```

**并行生成：** 协调智能体可以在一个响应中调用多个 `Task`——子智能体并行运行：

```
# 一个协调智能体响应包含：
Task 1: "搜索关于 X 的文章"
Task 2: "分析文档 Y"
Task 3: "搜索关于 Z 的文章"
# 三个同时运行
```

## 3.5 Agent SDK 中的钩子

钩子允许在智能体生命周期的特定点进行拦截和转换。

**PostToolUse** 在工具结果提供给模型之前拦截它：

```python
# 示例：规范化来自不同 MCP 工具的日期格式
@hook("PostToolUse")
def normalize_dates(tool_result):
    # 将 Unix 时间戳转换为 ISO 8601
    # 将 "Mar 5, 2025" 转换为 "2025-03-05"
    return normalized_result
```

**出站调用拦截钩子**阻止违反策略的操作：

```python
# 示例：阻止超过 500 美元的退款
@hook("PreToolUse")
def enforce_refund_limit(tool_call):
    if tool_call.name == "process_refund" and tool_call.args.amount > 500:
        return redirect_to_escalation(tool_call)
```

**关键区别：钩子与提示指令**

| 属性 | 钩子 | 提示指令 |
|---|---|---|
| 保证 | **确定性**（100%） | **概率性**（>90%，非 100%） |
| 使用时机 | 关键业务规则、财务操作、合规性 | 一般偏好、建议、格式 |
| 示例 | 阻止 > $500 的退款 | "尝试先解决再升级" |

**规则：** 当失败有财务、法律或安全后果时——使用钩子，而非提示。

## 3.6 `fork_session` 与会话管理

**`--resume <session-name>`** 恢复命名会话：

```bash
claude --resume investigation-auth-bug
```

- 继续之前保存上下文的对话
- 适用于跨多个会话的长期调查
- 风险：如果自上次会话以来文件已更改，工具结果可能已过时

**`fork_session`** 从共享上下文创建独立分支：

```
代码库调查
         |
    fork_session
    /           \
方法 A：         方法 B：
Redux           Context API
```

- 两个分支继承分支点之前的上下文
- 之后，它们独立分叉
- 适用于比较方法或测试策略

**何时启动新会话而非恢复：**
- 工具结果已过时（文件已更改）
- 已过很长时间，上下文已降级
- 以"以下是我们发现的简短摘要：..."重新开始，比用旧工具数据恢复更可靠

---

