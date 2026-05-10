# Everything-Claude-Code (ECC) 完整使用教程

[![Version](https://img.shields.io/badge/version-2.0.0--rc.1-blue)](https://github.com/affaan-m/everything-claude-code)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-教程文档-brightgreen)](./ECC完整使用教程.docx)

> 将 Claude Code 转变为功能强大的 AI 辅助开发平台 —— 包含 89 条规则、147 个技能、48 个智能体、68 条命令

## 概述

Everything-Claude-Code（ECC）是一套完整的 Claude Code 配置集合，经过 10 个月以上高强度日常使用打磨。由 Anthropic 黑客松获奖者 [Affaan Mustafa](https://x.com/affaanmustafa) 开发。

本仓库提供 ECC 的**完整中文使用教程**，帮助你快速掌握 ECC 的全部功能。

## 快速开始

### 安装 ECC

```bash
# 通过 npm 安装
npm install -g ecc-universal

# 安装完整配置
npx ecc-install --profile full

# 或安装特定语言配置
npx ecc typescript
npx ecc python
npx ecc go
```

### 通过 Claude Code 插件系统安装

```bash
/plugin install everything-claude-code@everything-claude-code
```

## 包含内容

| 类别 | 数量 | 说明 |
|------|------|------|
| **规则 (Rules)** | 89 条 | 14 种编程语言的编码规范 |
| **技能 (Skills)** | 147 个 | 专业化工作流，涵盖开发全流程 |
| **智能体 (Agents)** | 48 个 | 专业 AI 代理，自动执行复杂任务 |
| **命令 (Commands)** | 68 条 | 快捷操作，斜杠调用 |

## 教程章节

1. **简介与概述** — ECC 是什么、核心能力
2. **安装指南** — npm/插件安装、Profile/Target 选项
3. **核心概念** — Rules、Skills、Agents、Commands、Hooks
4. **模块详解** — 20 个模块的分类说明
5. **规则使用指南** — 14 种语言规则、自定义规则
6. **技能使用指南** — 核心技能速查、调用方式
7. **智能体使用指南** — 48 个 Agent 分类、调用方式
8. **命令使用指南** — 68 个命令速查、推荐工作流
9. **钩子配置指南** — Hooks 启用、GateGuard 安全机制
10. **常见工作流** — 功能开发/Bug修复/重构/PR/CI
11. **最佳实践** — 日常开发、安全、性能、团队协作

## 支持的语言

C · C++ · C# · Dart · Go · Java · Kotlin · Perl · PHP · Python · Rust · Swift · TypeScript · Web

## 支持的平台

Claude Code · Cursor · Antigravity · Codex · Gemini · OpenCode · CodeBuddy

## 核心功能

### 代码审查
每种语言都有专属的 Code Reviewer 智能体，覆盖类型安全、异步正确性、安全漏洞、性能优化等。

### 构建修复
自动诊断和修复各语言的构建错误：Go vet、Rust borrow checker、Java Maven/Gradle、C++ CMake 等。

### TDD 测试驱动开发
完整的测试支持体系：单元测试 → 集成测试 → E2E 测试，强制测试先行。

### 安全扫描
自动检测 OWASP Top 10 漏洞、密钥泄露、SSRF、注入攻击等安全问题。

### 数据库优化
PostgreSQL 查询优化、Schema 设计、数据迁移、Supabase 最佳实践。

## 常用命令

```bash
/code-review      # 审查代码
/build-fix        # 修复构建错误
/test-coverage    # 检查测试覆盖率
/plan             # 规划功能架构
/feature-dev      # 端到端功能开发
/refactor-clean   # 清理重构代码
/update-docs      # 更新文档
/harness-audit    # 审计 ECC 配置
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `ECC完整使用教程.docx` | 完整的 Word 格式使用教程 |
| `generate-ecc-tutorial.js` | 教程 Word 文档生成脚本 |
| `README.md` | 本文件 |

## 版本要求

- Node.js >= 18
- Claude Code CLI
- Git（可选，用于自动更新）

## 参考资源

- [ECC 官方仓库](https://github.com/affaan-m/everything-claude-code)
- [ECC npm 包](https://www.npmjs.com/package/ecc-universal)
- [Claude Code 文档](https://docs.claude.codes)
- [问题反馈](https://github.com/affaan-m/everything-claude-code/issues)

## 许可证

MIT License

---

**生成日期：** 2026年5月10日  
**教程版本：** 基于 ECC 2.0.0-rc.1 Full Profile
