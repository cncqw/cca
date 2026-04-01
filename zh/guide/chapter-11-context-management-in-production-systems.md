# 第11章：生产系统中的上下文管理

## 11.1 将关键事实提取到独立块中

与其依赖对话历史（摘要过程中会退化），不如将关键事实提取到结构化块中：

```
=== 案例事实（每次出现新事实时更新）===
客户ID：CUST-12345
订单ID：ORD-67890
订单日期：2025-01-15
订单金额：$89.99
问题：交货时商品损坏
客户要求：全额退款
状态：待经理审批
===
```

无论历史记录如何被摘要，都应在每个提示词中包含此块。

## 11.2 裁剪工具返回结果

如果 `lookup_order` 返回40+个字段，但当前任务只需要其中5个：

```python
# PostToolUse钩子：只保留相关字段
@hook("PostToolUse", tool="lookup_order")
def trim_order_fields(result):
    return {
        "order_id": result["order_id"],
        "status": result["status"],
        "total": result["total"],
        "items": result["items"],
        "return_eligible": result["return_eligible"]
    }
```

这能节省上下文空间并减少噪音。

## 11.3 位置感知的输入

在编写输入时，应考虑"中间迷失"效应，将关键信息放在适当位置：

```
[关键发现——置于顶部]
发现3个严重漏洞...

[详细结果——置于中间]
=== 文件 auth.ts ===
...
=== 文件 database.ts ===
...

[行动项——置于末尾]
优先级：在合并前修复 auth.ts 中的漏洞。
```

## 11.4 草稿文件

在长时间调查中，智能体可以将关键发现写入草稿文件：

```
# investigation-scratchpad.md
## 关键发现
- src/payments/processor.ts 中的 PaymentProcessor 继承自 BaseProcessor
- refund() 在3处被调用：OrderController、AdminPanel、CronJob
- 外部 PaymentGateway API 的速率限制为每分钟100次请求
- 迁移#47 添加了 refund_reason（NOT NULL）——2024-12-01
```

当上下文退化（或在新会话中），智能体可以查阅草稿文件，而无需重新运行发现流程。

## 11.5 委托子智能体以保护上下文

```
主智能体："调查支付模块的依赖关系"
  -> 子智能体（探索）：读取15个文件，追踪导入
  -> 返回："支付依赖于 AuthService、OrderModel 和外部 PaymentGateway API"

主智能体：在上下文中只保留一行，而非15个文件
```

**独立上下文层：**
在多智能体系统中，每个子智能体在有限的上下文预算内运行——它只接收完成任务所需的信息。协调者充当独立的上下文层：汇总子智能体输出、存储全局状态并分配上下文。这可以防止"上下文泄漏"——即一个智能体用与其他智能体无关的信息消耗掉整个窗口。

**为子智能体设置受限上下文预算：**
- 发送最小化上下文：一个具体任务+必要数据
- 指示子智能体返回结构化结果，而非原始数据转储
- 使用 `allowedTools` 限制子智能体的工具集——工具越少意味着干扰越少，上下文成本越低

## 11.6 结构化状态持久化（用于崩溃恢复）

每个智能体将其状态导出到已知位置：

```json
// agent-state/web-search-agent.json
{
  "status": "completed",
  "queries_executed": ["AI music 2024", "AI music composition"],
  "results_count": 12,
  "key_findings": [...],
  "coverage": ["music composition", "music production"],
  "gaps": ["music distribution", "music licensing"]
}
```

协调者在恢复时加载清单：

```json
// agent-state/manifest.json
{
  "web-search": "completed",
  "doc-analysis": "in_progress",
  "synthesis": "not_started"
}
```

---

