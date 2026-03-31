---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Claude 认证架构师"
  text: "基础认证"
  tagline: 掌握 Claude 技术栈，成为认证架构师
  image:
    src: /logo.svg
    alt: CCA Logo
  actions:
    - theme: brand
      text: 开始学习
      link: /zh/guide/claude-certified-architect-foundations-certification
    - theme: alt
      text: 官方文档
      link: /zh/guide/official-documentation
    - theme: alt
      text: 模拟考试
      link: /zh/guide/practice-test

features:
  - icon: 🤖
    title: 代理架构
    details: 掌握多智能体架构与编排（27%）- Agent SDK、子智能体协调、任务分解
    link: /zh/guide/domain-1-agent-architecture-and-orchestration
  - icon: 🔧
    title: 工具设计与 MCP
    details: 工具设计与 MCP 集成（18%）- Model Context Protocol、工具定义、JSON Schema
    link: /zh/guide/domain-2-tool-design-and-mcp-integration
  - icon: 💻
    title: Claude Code
    details: Claude Code 配置与工作流（20%）- CLAUDE.md、MCP 服务器、Hooks、CI/CD
    link: /zh/guide/domain-3-claude-code-configuration-and-workflows
  - icon: ✨
    title: 提示工程
    details: 提示工程与结构化输出（20%）- 少样本示例、JSON Schema、数据提取
    link: /zh/guide/domain-4-prompt-engineering-and-structured-output
  - icon: 🧠
    title: 上下文管理
    details: 上下文管理与可靠性（15%）- 长文档处理、错误处理、人机协作
    link: /zh/guide/domain-5-context-management-and-reliability

---

<style>
:root {
  --vp-home-hero-name-color: #d97757;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #d97757 30%, #e09f84);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #d97757 50%, #e09f84 50%);
  --vp-home-hero-image-filter: blur(44px);
}

.VPFeature {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.VPFeature:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.VPFeature .icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.VPFeature .title {
  font-size: 0.95rem;
}

.VPFeature .details {
  font-size: 0.85rem;
}
</style>

## 课程访问

> 目前，认证仅限 Anthropic 合作伙伴网络成员申请，且需使用已验证的合作伙伴公司邮箱进行注册。Claude 合作伙伴网络：https://claude.com/partners
前 5000 名合作公司员工免费。正式版售价为 99 美元。
如需申请访问官方课程/考试门户网站，请使用此链接：https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request

## 考试概览

**Claude 认证架构师 — 基础** 认证验证您在使用 Claude 技术构建生产级应用时的决策能力。

| 项目 | 详情 |
|------|------|
| **题型** | 单选题（4选1） |
| **通过分数** | 720 / 1000 |
| **场景题** | 6选4随机抽选 |
| **备考时间** | 建议 6个月+ 实践经验 |

## 核心技能

- **Claude Agent SDK** — 多智能体编排、子智能体委派、工具集成
- **Claude Code** — CLAUDE.md、MCP 服务器、Agent Skills、规划模式
- **Model Context Protocol (MCP)** — 工具和资源集成
- **提示工程** — JSON Schema、少样本示例、数据提取模板
- **上下文管理** — 长文档处理、多智能体上下文传递
- **CI/CD 集成** — 自动化代码审查、测试生成

## 学习路径

1. **理论基础** — 从 [第一部分：理论基础](/zh/guide/part-i-theory-foundations) 开始系统学习
2. **考试重点** — 深入研读 [5大考试领域](/zh/guide/part-ii-exam-domain-notes)
3. **实战练习** — 完成 [例题解析](/zh/guide/examples-of-exam-questions-with-explanations)
4. **模拟测试** — 通过 [模拟考试](/zh/guide/practice-test) 检验学习成果

## 官方资源

- [Claude API 文档](https://platform.claude.com/docs/en/api/messages)
- [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Code 文档](https://code.claude.com/docs/en/overview)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)
