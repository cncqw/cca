import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: 'CCA Guide',
  description: 'Claude Certified Architect Study Guide',
  cleanUrls: true,
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search docs'
              },
              modal: {
                displayDetails: 'Display detailed list',
                resetButtonTitle: 'Reset search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results for',
                footer: {
                  selectText: 'to select',
                  selectKeyAriaLabel: 'enter',
                  navigateText: 'to navigate',
                  navigateUpKeyAriaLabel: 'up arrow',
                  navigateDownKeyAriaLabel: 'down arrow',
                  closeText: 'to close',
                  closeKeyAriaLabel: 'escape'
                }
              }
            }
          },
          zh: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '重置搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '未找到结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          }
        }
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' },
      {
        icon: 'linktree',
        link: 'https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request',
        ariaLabel: 'CCA Official Site'
      }
    ]
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      link: '/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/claude-certified-architect-foundations-certification' }
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'Overview',
              collapsed: false,
              items: [
                { text: 'Foundations Certification', link: '/guide/claude-certified-architect-foundations-certification' },
                { text: 'Official Documentation', link: '/guide/official-documentation' },
              ]
            },
            {
              text: 'Part I: Theory Foundations',
              collapsed: false,
              items: [
                { text: 'Chapter 1: Claude API', link: '/guide/chapter-1-claude-api-fundamentals-of-model-interaction' },
                { text: 'Chapter 2: Tools and tool_use', link: '/guide/chapter-2-tools-and-tool-use' },
                { text: 'Chapter 3: Claude Agent SDK', link: '/guide/chapter-3-claude-agent-sdk-building-agentic-systems' },
                { text: 'Chapter 4: Model Context Protocol', link: '/guide/chapter-4-model-context-protocol' },
                { text: 'Chapter 5: Claude Code Configuration', link: '/guide/chapter-5-claude-code-configuration-and-workflows' },
                { text: 'Chapter 6: Prompt Engineering', link: '/guide/chapter-6-prompt-engineering-advanced-techniques' },
                { text: 'Chapter 7: Message Batches API', link: '/guide/chapter-7-message-batches-api' },
                { text: 'Chapter 8: Task Decomposition', link: '/guide/chapter-8-task-decomposition-strategies' },
                { text: 'Chapter 9: Escalation and Human-in-the-Loop', link: '/guide/chapter-9-escalation-and-human-in-the-loop' },
                { text: 'Chapter 10: Error Handling', link: '/guide/chapter-10-error-handling-in-multi-agent-systems' },
                { text: 'Chapter 11: Context Management', link: '/guide/chapter-11-context-management-in-production-systems' },
                { text: 'Chapter 12: Preserving Provenance', link: '/guide/chapter-12-preserving-provenance' },
                { text: 'Chapter 13: Built-in Tools', link: '/guide/chapter-13-claude-code-built-in-tools' },
              ]
            },
            {
              text: 'Part II: Exam Domain Notes',
              collapsed: true,
              items: [
                { text: 'Domain 1: Agent Architecture (27%)', link: '/guide/domain-1-agent-architecture-and-orchestration' },
                { text: 'Domain 2: Tool Design and MCP (18%)', link: '/guide/domain-2-tool-design-and-mcp-integration' },
                { text: 'Domain 3: Claude Code Workflows (20%)', link: '/guide/domain-3-claude-code-configuration-and-workflows' },
                { text: 'Domain 4: Prompt Engineering (20%)', link: '/guide/domain-4-prompt-engineering-and-structured-output' },
                { text: 'Domain 5: Context Management (15%)', link: '/guide/domain-5-context-management-and-reliability' },
              ]
            },
            {
              text: 'Practice',
              collapsed: true,
              items: [
                { text: 'Examples with Explanations', link: '/guide/examples-of-exam-questions-with-explanations' },
                { text: 'Practice Test', link: '/guide/practice-test' },
                { text: 'Practical Exercises', link: '/guide/practical-exercises' },
              ]
            },
            {
              text: 'Appendix',
              collapsed: true,
              items: [
                { text: 'Technologies and Concepts', link: '/guide/appendix-technologies-and-concepts' },
                { text: 'Out-of-Scope Topics', link: '/guide/out-of-scope-topics' },
                { text: 'Preparation Recommendations', link: '/guide/preparation-recommendations' },
              ]
            },
          ]
        }
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '指南', link: '/zh/guide/claude-certified-architect-foundations-certification' }
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '概述',
              collapsed: false,
              items: [
                { text: '基础认证', link: '/zh/guide/claude-certified-architect-foundations-certification' },
                { text: '官方文档', link: '/zh/guide/official-documentation' },
              ]
            },
            {
              text: '基础',
              collapsed: false,
              items: [
                { text: '第1章：Claude API', link: '/zh/guide/chapter-1-claude-api-fundamentals-of-model-interaction' },
                { text: '第2章：工具与 tool_use', link: '/zh/guide/chapter-2-tools-and-tool-use' },
                { text: '第3章：Claude Agent SDK', link: '/zh/guide/chapter-3-claude-agent-sdk-building-agentic-systems' },
                { text: '第4章：模型上下文协议', link: '/zh/guide/chapter-4-model-context-protocol' },
                { text: '第5章：Claude Code 配置', link: '/zh/guide/chapter-5-claude-code-configuration-and-workflows' },
                { text: '第6章：提示工程', link: '/zh/guide/chapter-6-prompt-engineering-advanced-techniques' },
                { text: '第7章：消息批处理 API', link: '/zh/guide/chapter-7-message-batches-api' },
                { text: '第8章：任务分解', link: '/zh/guide/chapter-8-task-decomposition-strategies' },
                { text: '第9章：升级与人工参与', link: '/zh/guide/chapter-9-escalation-and-human-in-the-loop' },
                { text: '第10章：错误处理', link: '/zh/guide/chapter-10-error-handling-in-multi-agent-systems' },
                { text: '第11章：上下文管理', link: '/zh/guide/chapter-11-context-management-in-production-systems' },
                { text: '第12章：保存溯源信息', link: '/zh/guide/chapter-12-preserving-provenance' },
                { text: '第13章：内置工具', link: '/zh/guide/chapter-13-claude-code-built-in-tools' },
              ]
            },
            {
              text: '考点',
              collapsed: true,
              items: [
                { text: '智能体架构与编排(27%)', link: '/zh/guide/domain-1-agent-architecture-and-orchestration' },
                { text: '工具设计与MCP集成(18%)', link: '/zh/guide/domain-2-tool-design-and-mcp-integration' },
                { text: 'Claude Code配置与工作流(20%)', link: '/zh/guide/domain-3-claude-code-configuration-and-workflows' },
                { text: '提示工程与结构化输出(20%)', link: '/zh/guide/domain-4-prompt-engineering-and-structured-output' },
                { text: '上下文管理与可靠性(15%)', link: '/zh/guide/domain-5-context-management-and-reliability' },
              ]
            },
            {
              text: '练习',
              collapsed: true,
              items: [
                { text: '例题解析', link: '/zh/guide/examples-of-exam-questions-with-explanations' },
                { text: '模拟测试', link: '/zh/guide/practice-test' },
                { text: '实践练习', link: '/zh/guide/practical-exercises' },
              ]
            },
            {
              text: '附录',
              collapsed: true,
              items: [
                { text: '技术和概念', link: '/zh/guide/appendix-technologies-and-concepts' },
                { text: '考试范围外主题', link: '/zh/guide/out-of-scope-topics' },
                { text: '备考建议', link: '/zh/guide/preparation-recommendations' },
              ]
            },
          ]
        }
      }
    }
  }
})
