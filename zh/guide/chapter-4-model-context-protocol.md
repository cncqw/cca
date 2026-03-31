# 第 4 章：模型上下文协议（MCP）

> 文档：[MCP](https://modelcontextprotocol.io/) | [工具](https://modelcontextprotocol.io/docs/concepts/tools) | [资源](https://modelcontextprotocol.io/docs/concepts/resources) | [服务器](https://modelcontextprotocol.io/docs/concepts/servers)

## 4.1 什么是 MCP

模型上下文协议（MCP）是一种用于将外部系统连接到 Claude 的开放协议。MCP 定义了三种主要资源类型：

1. **工具** — 代理可以调用以执行操作的函数（CRUD 操作、API 调用、命令执行）
2. **资源** — 代理可以读取以获取上下文的数据（文档、数据库模式、内容目录）
3. **提示** — 用于常见任务的预定义提示模板

## 4.2 MCP 服务器

MCP 服务器是实现 MCP 协议并提供工具/资源的进程。当您连接到 MCP 服务器时：
- 所有工具都会自动被发现
- 来自所有已连接服务器的工具同时可用
- 工具描述决定模型将如何使用它们

## 4.3 配置 MCP 服务器

**项目配置（`.mcp.json`）** — 供团队使用：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "jira": {
      "command": "npx",
      "args": ["-y", "mcp-server-jira"],
      "env": {
        "JIRA_TOKEN": "${JIRA_TOKEN}"
      }
    }
  }
}
```

**要点：**
- `.mcp.json` 存储在项目根目录并通过版本控制进行管理
- 环境变量（`${GITHUB_TOKEN}`）用于存储密钥——令牌本身不会被提交
- 所有项目贡献者均可使用

**用户配置（`~/.claude.json`）** — 用于个人/实验性服务器：
- 存储在用户的主目录中
- 不通过版本控制共享
- 适合个人实验和测试

**选择服务器：**
- 对于标准集成（Jira、GitHub、Slack），优先使用现有的社区 MCP 服务器
- 仅为独特的、团队专属的工作流构建自己的服务器

## 4.4 MCP 中的 `isError` 标志

当 MCP 工具遇到错误时，它在响应中使用 `isError: true`。这向代理发出信号，表明调用失败。

**结构化错误（推荐做法）：**

```json
{
  "isError": true,
  "content": {
    "errorCategory": "transient",
    "isRetryable": true,
    "message": "The service is temporarily unavailable. Timeout while calling the orders API.",
    "attempted_query": "order_id=12345",
    "partial_results": null
  }
}
```

**通用错误（反模式）：**

```json
{
  "isError": true,
  "content": "Operation failed"
}
```

通用错误不为代理提供任何决策信息——它应该重试、更改查询还是升级？

## 4.5 MCP 资源

资源是代理可以请求以获取上下文而无需执行操作的数据：

- 内容目录（例如，所有项目任务的列表、层级导航）
- 数据库模式（了解数据结构）
- 文档（API 参考、内部指南）
- 问题/任务摘要

**资源优势：** 代理无需进行探索性工具调用即可了解存在哪些数据。资源提供了一个即时的"地图"。

---

