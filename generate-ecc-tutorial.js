const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableCell, TableRow, WidthType, AlignmentType,
  BorderStyle, PageBreak, ShadingType,
} = require('docx');

// ============================================================
// Helpers
// ============================================================

const STYLES = {
  heading1: { heading: HeadingLevel.HEADING_1, size: 36, bold: true, color: '1a1a2e' },
  heading2: { heading: HeadingLevel.HEADING_2, size: 28, bold: true, color: '16213e' },
  heading3: { heading: HeadingLevel.HEADING_3, size: 24, bold: true, color: '0f3460' },
};

const border = { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' };
const cellBorders = { top: border, bottom: border, left: border, right: border };
const headerShading = { type: ShadingType.SOLID, color: '1a1a2e', fill: '1a1a2e' };

function h1(text) {
  return new Paragraph({
    heading: STYLES.heading1.heading,
    spacing: { before: 480, after: 240 },
    children: [new TextRun({ text, size: 36, bold: true, color: '1a1a2e', font: 'Microsoft YaHei' })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: STYLES.heading2.heading,
    spacing: { before: 360, after: 180 },
    children: [new TextRun({ text, size: 28, bold: true, color: '16213e', font: 'Microsoft YaHei' })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: STYLES.heading3.heading,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, size: 24, bold: true, color: '0f3460', font: 'Microsoft YaHei' })],
  });
}

function p(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 360 },
    children: [new TextRun({ text, size: 22, color: '333333', font: 'Microsoft YaHei' })],
  });
}

function boldP(label, text) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 340 },
    children: [
      new TextRun({ text: label, size: 22, bold: true, color: '1a1a2e', font: 'Microsoft YaHei' }),
      new TextRun({ text, size: 22, color: '333333', font: 'Microsoft YaHei' }),
    ],
  });
}

function code(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 300 },
    indent: { left: 480 },
    shading: { type: ShadingType.SOLID, color: 'f4f4f4', fill: 'f4f4f4' },
    children: [new TextRun({ text, size: 18, color: 'e94560', font: 'Consolas' })],
  });
}

function bullet(text, level) {
  const lv = level || 0;
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 320 },
    indent: { left: 480 + lv * 360 },
    children: [
      new TextRun({ text: '• ', size: 20, color: 'e94560', font: 'Microsoft YaHei' }),
      new TextRun({ text, size: 20, color: '555555', font: 'Microsoft YaHei' }),
    ],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function spacer(h) {
  return new Paragraph({ spacing: { before: h || 120, after: h || 120 }, children: [] });
}

function makeRow(cells, isHeader) {
  const bg = isHeader ? headerShading : undefined;
  const color = isHeader ? 'ffffff' : '333333';
  const bold = isHeader;
  return new TableRow({
    tableHeader: isHeader,
    children: cells.map(function(c) {
      return new TableCell({
        shading: bg,
        borders: cellBorders,
        width: { size: c.w || 2500, type: WidthType.DXA },
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 40, after: 40 },
          children: [new TextRun({ text: c.t, size: 20, bold: bold, color: color, font: 'Microsoft YaHei' })],
        })],
      });
    }),
  });
}

function makeTable(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      makeRow(headers.map(function(t) { return { t: t }; }), true),
    ].concat(rows.map(function(r) {
      return makeRow(r.map(function(t) { return { t: t }; }), false);
    })),
  });
}

// ============================================================
// Document Content
// ============================================================

var sections = [];

// ---- Cover Page ----
sections.push(spacer(1200));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 600, after: 200 },
  children: [new TextRun({ text: 'Everything-Claude-Code', size: 56, bold: true, color: 'e94560', font: 'Consolas' })],
}));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 100, after: 100 },
  children: [new TextRun({ text: '(ECC) 完整使用教程', size: 44, bold: true, color: '1a1a2e', font: 'Microsoft YaHei' })],
}));
sections.push(spacer(400));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: '版本 2.0.0-rc.1 | Full Profile', size: 24, color: '888888', font: 'Microsoft YaHei' })],
}));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 80, after: 80 },
  children: [new TextRun({ text: '生成日期：2026年5月10日', size: 22, color: '888888', font: 'Microsoft YaHei' })],
}));
sections.push(spacer(600));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200, after: 80 },
  children: [new TextRun({ text: '包含 89 条规则 | 147 个技能 | 48 个智能体 | 68 条命令', size: 22, color: '666666', font: 'Microsoft YaHei' })],
}));

sections.push(pageBreak());

// ---- Table of Contents ----
sections.push(h1('目录'));
sections.push(p('（请在 Word 中插入自动目录：引用 → 目录 → 自动目录）'));
sections.push(spacer());
var tocItems = [
  '第1章  简介与概述',
  '第2章  安装指南',
  '第3章  核心概念',
  '第4章  模块详解',
  '第5章  规则（Rules）使用指南',
  '第6章  技能（Skills）使用指南',
  '第7章  智能体（Agents）使用指南',
  '第8章  命令（Commands）使用指南',
  '第9章  钩子（Hooks）配置指南',
  '第10章 常见工作流',
  '第11章 最佳实践',
  '附录',
];
tocItems.forEach(function(item) { sections.push(boldP('', item)); });

sections.push(pageBreak());

// ============================================================
// Chapter 1 - Introduction
// ============================================================
sections.push(h1('第1章  简介与概述'));

sections.push(h2('1.1 什么是 Everything-Claude-Code'));
sections.push(p('Everything-Claude-Code（简称 ECC）是一套完整的 Claude Code 配置集合，包含经过 10 个月以上高强度日常使用打磨的智能体（Agents）、技能（Skills）、钩子（Hooks）、规则（Rules）和命令（Commands）。由 Anthropic 黑客松获奖者开发，旨在将 Claude Code 转变为功能强大的 AI 辅助开发平台。'));
sections.push(p('ECC 的设计理念是"开箱即用"——安装后即可获得一套完整的多语言开发支持体系，覆盖从代码编写、审查、测试到部署的全流程。'));

sections.push(h2('1.2 ECC 的核心能力'));
sections.push(bullet('多语言开发支持：覆盖 C/C++、C#、Dart、Go、Java、Kotlin、Perl、PHP、Python、Rust、Swift、TypeScript 等 14 种编程语言'));
sections.push(bullet('全流程代码审查：每个语言都有专属的 Code Reviewer 智能体'));
sections.push(bullet('构建问题自动修复：针对各语言的构建错误自动诊断和修复'));
sections.push(bullet('TDD 测试驱动开发：从单元测试到端到端测试的完整支持'));
sections.push(bullet('安全漏洞扫描：自动检测 OWASP Top 10 安全漏洞'));
sections.push(bullet('数据库设计与优化：PostgreSQL 查询优化、Schema 设计、数据迁移'));
sections.push(bullet('DevOps 与部署：Docker、CI/CD、部署模式支持'));
sections.push(bullet('文档自动更新：代码地图（Codemap）和文档自动生成与更新'));
sections.push(bullet('多平台支持：Claude Code、Cursor、Codex、Gemini、OpenCode、CodeBuddy、Antigravity 等'));

sections.push(h2('1.3 版本信息'));
sections.push(boldP('当前版本：', '2.0.0-rc.1'));
sections.push(boldP('安装配置：', 'Full Profile（完整配置）'));
sections.push(boldP('安装模块：', '20 个模块，602 个文件操作'));
sections.push(boldP('仓库地址：', 'https://github.com/affaan-m/everything-claude-code'));

sections.push(pageBreak());

// ============================================================
// Chapter 2 - Installation
// ============================================================
sections.push(h1('第2章  安装指南'));

sections.push(h2('2.1 环境要求'));
sections.push(bullet('Node.js >= 18'));
sections.push(bullet('Claude Code CLI 已安装'));
sections.push(bullet('Git（用于从 GitHub 获取更新）'));
sections.push(bullet('npm 或 yarn 包管理器'));

sections.push(h2('2.2 通过 npm 安装'));
sections.push(p('ECC 发布为 npm 包 ecc-universal，可通过以下命令安装：'));
sections.push(code('npm install -g ecc-universal'));
sections.push(p('安装后，可以使用 ecc 或 ecc-install 命令：'));
sections.push(code('npx ecc-install --profile full'));
sections.push(code('npx ecc typescript'));
sections.push(code('npx ecc-install --profile minimal'));

sections.push(h2('2.3 通过插件系统安装'));
sections.push(p('ECC 同时作为 Claude Code 插件提供，可通过 Claude Code 插件系统安装：'));
sections.push(code('/plugin install everything-claude-code@everything-claude-code'));
sections.push(p('安装后运行配置命令：'));
sections.push(code('node ~/.claude/plugins/marketplaces/everything-claude-code/scripts/install-apply.js --profile full'));

sections.push(h2('2.4 安装配置选项'));

sections.push(h3('Profile 选项'));
sections.push(bullet('full — 完整安装，包含所有 20 个模块'));
sections.push(bullet('minimal — 最小化安装，仅包含核心模块'));
sections.push(bullet('typescript / python / java / go / rust — 各语言专用配置'));

sections.push(h3('Target 选项'));
sections.push(bullet('claude — 安装到 ~/.claude/（默认，Claude Code）'));
sections.push(bullet('cursor — 安装到 ./.cursor/（Cursor IDE）'));
sections.push(bullet('antigravity — 安装到 ./.agent/（Antigravity）'));
sections.push(bullet('codex / gemini / opencode / codebuddy — 其他 AI 编程工具'));

sections.push(h3('选择性安装'));
sections.push(code('node install-apply.js --modules rules-core,agents-core,security --target claude'));
sections.push(code('node install-apply.js --profile full --without supply-chain-domain'));

sections.push(h2('2.5 验证安装'));
sections.push(code('ls ~/.claude/rules/ecc/common/'));
sections.push(code('ls ~/.claude/skills/ecc/'));
sections.push(code('ls ~/.claude/agents/'));
sections.push(code('ls ~/.claude/commands/'));
sections.push(code('cat ~/.claude/ecc/install-state.json'));

sections.push(pageBreak());

// ============================================================
// Chapter 3 - Core Concepts
// ============================================================
sections.push(h1('第3章  核心概念'));

sections.push(h2('3.1 规则（Rules）'));
sections.push(p('规则是 ECC 的核心组成部分，定义了 Claude Code 在进行代码操作时应遵循的标准和规范。规则分为三个层级：'));
sections.push(boldP('通用规则（common/）：', '适用于所有项目的通用编码规范，包括代码风格、安全、测试、性能、Git 工作流等 10 个文件。'));
sections.push(boldP('语言规则（<lang>/）：', '针对特定编程语言的规范，覆盖 14 种语言，每种语言 5 个核心文件。'));
sections.push(boldP('中文规则（zh/）：', '通用规则的中文翻译版，共 10 个文件。'));

sections.push(h3('通用规则文件'));
sections.push(makeTable(
  ['规则文件', '说明'],
  [
    ['agents.md', '智能体使用规范，定义何时以及如何使用各类智能体'],
    ['code-review.md', '代码审查标准，包括审查清单和反馈格式'],
    ['coding-style.md', '代码风格规范，涵盖命名、格式、注释等'],
    ['development-workflow.md', '开发工作流规范'],
    ['git-workflow.md', 'Git 工作流规范，分支管理和 PR 流程'],
    ['hooks.md', '钩子使用规范'],
    ['patterns.md', '设计模式指南，SOLID 原则和常见模式'],
    ['performance.md', '性能优化规范'],
    ['security.md', '安全编码规范，OWASP Top 10'],
    ['testing.md', '测试规范，单元测试/集成测试/E2E'],
  ],
));

sections.push(h3('语言特定规则结构'));
sections.push(makeTable(
  ['规则文件', '覆盖内容'],
  [
    ['coding-style.md', '命名约定、代码格式、惯用语法'],
    ['patterns.md', '语言特有的设计模式和最佳实践'],
    ['security.md', '语言常见安全漏洞和防范措施'],
    ['testing.md', '测试框架、模式和覆盖率要求'],
    ['hooks.md', '钩子配置和使用方式'],
  ],
));

sections.push(h2('3.2 技能（Skills）'));
sections.push(p('技能是可调用的专业化工作流，每个技能封装了特定领域的知识和操作流程。技能通过 /skill-name 或 Skill 工具调用。ECC 提供 147 个技能，涵盖以下类别：'));
sections.push(bullet('语言与框架：TypeScript、Python、Go、Rust、Java/Kotlin、C++、Dart/Flutter、Swift 等'));
sections.push(bullet('安全与合规：安全审查、漏洞扫描、HIPAA/PHI 合规'));
sections.push(bullet('质量保证：代码审查、TDD、测试覆盖率、构建修复'));
sections.push(bullet('DevOps：Docker 模式、部署模式、CI/CD'));
sections.push(bullet('数据库：PostgreSQL 模式、数据库迁移'));
sections.push(bullet('前端：前端模式、设计系统、SEO、可访问性'));
sections.push(bullet('业务领域：供应链、能源采购、物流异常处理'));
sections.push(bullet('AI 工程：AI 优先工程、提示优化、Token 预算'));
sections.push(bullet('内容创作：文章写作、视频编辑、幻灯片制作'));

sections.push(h2('3.3 智能体（Agents）'));
sections.push(p('智能体是具有特定专业能力的自主代理，可被调用执行复杂的多步骤任务。ECC 提供 48 个智能体：'));

sections.push(h3('代码智能体'));
sections.push(bullet('code-reviewer — 通用代码审查专家'));
sections.push(bullet('code-simplifier — 代码简化重构专家'));
sections.push(bullet('code-explorer — 代码库深度分析专家'));
sections.push(bullet('code-architect — 功能架构设计专家'));
sections.push(bullet('refactor-cleaner — 死代码清理专家'));
sections.push(bullet('planner — 复杂功能规划专家'));

sections.push(h3('语言专用智能体'));
sections.push(bullet('typescript-reviewer / java-reviewer / python-reviewer / go-reviewer / rust-reviewer'));
sections.push(bullet('cpp-reviewer / csharp-reviewer / kotlin-reviewer / flutter-reviewer'));

sections.push(h3('构建修复智能体'));
sections.push(bullet('build-error-resolver / go-build-resolver / java-build-resolver'));
sections.push(bullet('rust-build-resolver / cpp-build-resolver / kotlin-build-resolver'));
sections.push(bullet('dart-build-resolver / pytorch-build-resolver'));

sections.push(h3('安全与质量智能体'));
sections.push(bullet('security-reviewer — 安全漏洞检测'));
sections.push(bullet('silent-failure-hunter — 静默失败检测'));
sections.push(bullet('tdd-guide — TDD 方法论指导'));
sections.push(bullet('database-reviewer — PostgreSQL 数据库专家'));
sections.push(bullet('performance-optimizer — 性能优化专家'));

sections.push(h3('专业领域智能体'));
sections.push(bullet('seo-specialist / a11y-architect / healthcare-reviewer'));
sections.push(bullet('gan-evaluator / gan-generator / gan-planner'));
sections.push(bullet('opensource-forker / opensource-sanitizer / opensource-packager'));

sections.push(h2('3.4 命令（Commands）'));
sections.push(p('命令是可通过斜杠（/）调用的快捷操作。ECC 提供 68 个命令：'));

sections.push(h3('开发命令'));
sections.push(bullet('/code-review — 触发代码审查'));
sections.push(bullet('/build-fix — 修复构建错误'));
sections.push(bullet('/test-coverage — 检查测试覆盖率'));
sections.push(bullet('/refactor-clean — 清理重构代码'));
sections.push(bullet('/checkpoint — 创建检查点'));
sections.push(bullet('/evolve — 演进式开发'));
sections.push(bullet('/plan — 启动规划流程'));
sections.push(bullet('/feature-dev — 启动功能开发流程'));

sections.push(h3('语言专用命令'));
sections.push(bullet('/cpp-build | /cpp-review | /cpp-test — C++'));
sections.push(bullet('/go-build | /go-review | /go-test — Go'));
sections.push(bullet('/java-build | /java-review | /java-test — Java'));
sections.push(bullet('/kotlin-build | /kotlin-review | /kotlin-test — Kotlin'));
sections.push(bullet('/rust-build | /rust-review | /rust-test — Rust'));
sections.push(bullet('/flutter-build | /flutter-review | /flutter-test — Flutter'));

sections.push(h3('工作流命令'));
sections.push(bullet('/multi-plan /multi-execute /multi-backend /multi-frontend'));
sections.push(bullet('/prp-plan /prp-implement /prp-commit /prp-pr'));
sections.push(bullet('/santa-loop /loop-start /loop-status'));

sections.push(h3('维护命令'));
sections.push(bullet('/update-codemaps /update-docs /harness-audit /prune'));
sections.push(bullet('/save-session /resume-session /sessions'));
sections.push(bullet('/skill-create /skill-health /skill-stocktake'));

sections.push(h2('3.5 钩子（Hooks）'));
sections.push(p('钩子是 ECC 的自动化机制，可在特定事件（工具调用前后、会话开始/结束等）自动执行脚本。ECC 预置了完整的钩子系统：'));
sections.push(bullet('PreToolUse — 工具调用前的检查和验证'));
sections.push(bullet('PostToolUse — 工具调用后的日志和通知'));
sections.push(bullet('SessionStart — 会话启动时的环境初始化'));
sections.push(bullet('Stop — 会话结束时的清理操作'));
sections.push(bullet('PreCompact — 对话压缩前的状态保存'));
sections.push(bullet('GateGuard — Bash 命令执行前的事实验证机制'));

sections.push(pageBreak());

// ============================================================
// Chapter 4 - Modules
// ============================================================
sections.push(h1('第4章  模块详解'));

sections.push(p('Full Profile 包含 20 个模块，总共有 602 个文件操作。以下是各模块的详细说明：'));

sections.push(h2('4.1 核心模块'));

sections.push(h3('rules-core'));
sections.push(p('包含 89 个规则文件，覆盖通用规范、中文本地化规范和 14 种编程语言的专业规范。是所有开发工作的基础准则。'));

sections.push(h3('agents-core'));
sections.push(p('包含 48 个专业智能体定义，覆盖代码审查、构建修复、安全检测、性能优化、数据库设计等各类专业领域。'));

sections.push(h3('commands-core'));
sections.push(p('包含 68 个可调用命令，提供快捷的开发操作入口。'));

sections.push(h3('hooks-runtime'));
sections.push(p('钩子运行时环境和预置的钩子脚本，包括 GateGuard 安全机制。'));

sections.push(h3('platform-configs'));
sections.push(p('多平台配置支持，包括 Claude Code、Cursor、Codex、Gemini、OpenCode、CodeBuddy 等。'));

sections.push(h2('4.2 功能模块'));

sections.push(h3('framework-language'));
sections.push(p('各语言和框架的开发模式与最佳实践技能。'));

sections.push(h3('database'));
sections.push(p('数据库设计和优化技能：PostgreSQL 模式、数据库迁移、ClickHouse 等。'));

sections.push(h3('workflow-quality'));
sections.push(p('开发工作流和质量保证工具：TDD、代码审查、构建修复、测试覆盖、E2E 测试等。'));

sections.push(h3('security'));
sections.push(p('安全相关技能：安全审查、漏洞扫描、HIPAA/PHI 合规、DeFi 安全等。'));

sections.push(h3('research-apis'));
sections.push(p('研究和 API 集成：深度研究、Exa 搜索、API 设计、API 连接器等。'));

sections.push(h3('business-content'));
sections.push(p('业务内容生成：文章写作、品牌声音、市场研究、投资材料等。'));

sections.push(h3('operator-workflows'));
sections.push(p('运维工作流：自动化审计、电子邮件运维、GitHub 运维、消息运维等。'));

sections.push(h3('social-distribution'));
sections.push(p('社交媒体分发：跨平台发布、社交图谱排名等。'));

sections.push(h3('media-generation'));
sections.push(p('媒体生成：Manim 视频、Remotion 视频、视频编辑、幻灯片等。'));

sections.push(h3('orchestration'));
sections.push(p('编排和多步骤工作流：蓝图、DMUX 工作流、多步骤执行等。'));

sections.push(h3('swift-apple'));
sections.push(p('Apple 平台：Swift 并发 6.2、SwiftUI 模式、协议 DI 测试、Actor 持久化等。'));

sections.push(h3('agentic-patterns'));
sections.push(p('AI 智能体工程：智能体构建、自省调试、AI 回归测试、AI 优先工程等。'));

sections.push(h3('devops-infra'));
sections.push(p('DevOps 基础设施：Docker 模式、部署模式、PM2 管理、终端运维等。'));

sections.push(h3('supply-chain-domain'));
sections.push(p('供应链管理：物流异常管理、海关贸易合规、库存需求计划、质量管理、退货逆向物流等。'));

sections.push(h3('document-processing'));
sections.push(p('文档处理：营养文档处理、签证文档翻译等。'));

sections.push(pageBreak());

// ============================================================
// Chapter 5 - Rules Usage
// ============================================================
sections.push(h1('第5章  规则（Rules）使用指南'));

sections.push(h2('5.1 规则的工作原理'));
sections.push(p('规则被 Claude Code 在每次对话中自动加载（当项目匹配时）。规则定义了 AI 在编写、审查和修改代码时应遵循的标准。'));
sections.push(p('规则加载优先级：通用规则（common/）→ 语言规则（<lang>/）→ 项目规则。项目级规则可覆盖 ECC 规则。'));

sections.push(h2('5.2 支持的语言'));
sections.push(makeTable(
  ['语言', '规则数量', '覆盖领域'],
  [
    ['C', '5', '编码风格、设计模式、安全、测试、钩子'],
    ['C++', '5', '内存安全、现代 C++ 惯用法、模板错误处理'],
    ['C#', '5', '.NET 约定、异步模式、可空引用类型'],
    ['Dart', '5', 'Flutter 最佳实践、Widget 模式、状态管理'],
    ['Go', '5', '惯用 Go 模式、并发模式、错误处理'],
    ['Java', '5', '分层架构、JPA 模式、Spring Boot 安全'],
    ['Kotlin', '5', '协程安全、Compose 最佳实践、整洁架构'],
    ['Perl', '5', 'Perl 惯用法、安全实践、测试模式'],
    ['PHP', '5', 'Laravel 模式、安全实践、TDD 方法'],
    ['Python', '5', 'PEP 8 规范、Pythonic 惯用法、类型提示'],
    ['Rust', '5', '所有权/生命周期、unsafe 使用、错误处理'],
    ['Swift', '5', 'Actor 持久化、Swift 6.2 并发、协议 DI 测试'],
    ['TypeScript', '5', '类型安全、异步正确性、Node/Web 安全'],
    ['Web', '7', '前端性能、设计质量、SEO 基础（比普通多 2 个文件）'],
  ],
));

sections.push(h2('5.3 自定义规则'));
sections.push(p('在项目目录中创建 .claude/rules/ 目录来添加项目级规则，会与 ECC 规则合并。同名文件可覆盖 ECC 默认规则。'));

sections.push(pageBreak());

// ============================================================
// Chapter 6 - Skills Usage
// ============================================================
sections.push(h1('第6章  技能（Skills）使用指南'));

sections.push(h2('6.1 技能调用方式'));
sections.push(code('/skill-name                   # 斜杠命令方式'));
sections.push(code('Skill({ skill: "skill-name" }) # 工具调用方式'));

sections.push(h2('6.2 核心开发技能速查'));
sections.push(makeTable(
  ['技能名称', '功能说明', '适用场景'],
  [
    ['code-review', '通用代码审查', '代码修改后的质量检查'],
    ['build-fix', '构建错误修复', '编译/构建失败时'],
    ['test-coverage', '测试覆盖率管理', '确保测试覆盖率达标'],
    ['tdd-workflow', 'TDD 开发流程', '新功能开发时'],
    ['refactor-clean', '死代码清理', '代码库维护'],
    ['simplify', '代码简化优化', '代码重构时'],
    ['security-review', '安全漏洞审查', '涉及用户输入、认证时'],
    ['review-pr', 'PR 审查', '提交 PR 前'],
    ['plan', '架构规划设计', '复杂功能开发前'],
    ['feature-dev', '功能开发流程', '端到端功能实现'],
  ],
));

sections.push(h2('6.3 语言专用技能'));
sections.push(makeTable(
  ['技能名称', '适用语言'],
  [
    ['go-review / go-build / go-test', 'Go'],
    ['java-review / java-build / java-test', 'Java'],
    ['python-review / python-test', 'Python'],
    ['rust-review / rust-build / rust-test', 'Rust'],
    ['cpp-review / cpp-build / cpp-test', 'C++'],
    ['kotlin-review / kotlin-build / kotlin-test', 'Kotlin'],
    ['flutter-review / flutter-build / flutter-test', 'Flutter/Dart'],
    ['typescript-review', 'TypeScript/JavaScript'],
  ],
));

sections.push(h2('6.4 高级工作流技能'));
sections.push(bullet('plan — 复杂功能的架构规划和设计'));
sections.push(bullet('feature-dev — 端到端功能开发流程'));
sections.push(bullet('multi-plan / multi-execute — 多步骤工作流编排'));
sections.push(bullet('prp-plan / prp-implement / prp-commit / prp-pr — PR 流水线'));
sections.push(bullet('blueprint — 项目蓝图设计'));
sections.push(bullet('evolve — 渐进式代码演进'));

sections.push(h2('6.5 领域专业技能'));
sections.push(bullet('database-migrations — 数据库迁移管理'));
sections.push(bullet('postgres-patterns — PostgreSQL 最佳实践'));
sections.push(bullet('docker-patterns — Docker 容器化模式'));
sections.push(bullet('deployment-patterns — 部署策略模式'));
sections.push(bullet('api-design — API 设计规范'));
sections.push(bullet('frontend-patterns — 前端开发模式'));
sections.push(bullet('design-system — 设计系统构建'));
sections.push(bullet('seo — 技术 SEO 审计和优化'));
sections.push(bullet('accessibility — WCAG 2.2 无障碍合规'));

sections.push(pageBreak());

// ============================================================
// Chapter 7 - Agents Usage
// ============================================================
sections.push(h1('第7章  智能体（Agents）使用指南'));

sections.push(h2('7.1 智能体调用方式'));
sections.push(p('智能体通过 Agent 工具调用，指定 subagent_type 参数：'));
sections.push(code('Agent({ description: "审查代码", subagent_type: "code-reviewer", prompt: "..." })'));
sections.push(p('在对话中提到特定任务时，Claude Code 可能自动选择合适的智能体。'));

sections.push(h2('7.2 代码审查智能体'));
sections.push(makeTable(
  ['智能体名称', '专业领域'],
  [
    ['code-reviewer', '通用代码审查，适用于所有语言'],
    ['typescript-reviewer', 'TypeScript/JS：类型安全、异步正确性、安全'],
    ['python-reviewer', 'Python：PEP 8、Pythonic 惯用法、类型提示'],
    ['go-reviewer', 'Go：惯用 Go、并发模式、错误处理'],
    ['rust-reviewer', 'Rust：所有权、生命周期、unsafe 使用'],
    ['java-reviewer', 'Java/Spring Boot：分层架构、JPA、安全'],
    ['cpp-reviewer', 'C++：内存安全、现代 C++、并发'],
    ['csharp-reviewer', 'C#：.NET 约定、异步、可空引用'],
    ['kotlin-reviewer', 'Kotlin：协程、Compose、整洁架构'],
    ['flutter-reviewer', 'Flutter/Dart：Widget、状态管理、性能'],
  ],
));

sections.push(h2('7.3 构建修复智能体'));
sections.push(makeTable(
  ['智能体', '适用场景'],
  [
    ['build-error-resolver', '通用构建/TypeScript 错误'],
    ['go-build-resolver', 'go build / go vet 错误'],
    ['java-build-resolver', 'Maven/Gradle 编译错误'],
    ['rust-build-resolver', 'cargo build / borrow checker 问题'],
    ['cpp-build-resolver', 'CMake / 模板 / 链接错误'],
    ['kotlin-build-resolver', 'Gradle / Kotlin 编译器错误'],
    ['dart-build-resolver', 'dart analyze / pub 依赖问题'],
    ['pytorch-build-resolver', 'PyTorch 张量/CUDA/DataLoader 错误'],
  ],
));

sections.push(h2('7.4 安全与质量智能体'));
sections.push(bullet('security-reviewer — OWASP Top 10 漏洞检测，SSRF、注入、不安全加密'));
sections.push(bullet('silent-failure-hunter — 静默失败、吞没错误、错误传播问题检测'));
sections.push(bullet('tdd-guide — TDD 方法论指导，确保测试先行'));
sections.push(bullet('type-design-analyzer — 类型设计的封装性、不变性分析'));
sections.push(bullet('comment-analyzer — 代码注释的准确性、完整性、腐烂风险评估'));
sections.push(bullet('pr-test-analyzer — PR 测试覆盖质量和完整性审查'));
sections.push(bullet('e2e-runner — 端到端测试，Playwright + Vercel Agent Browser'));

sections.push(h2('7.5 开源发布流水线'));
sections.push(bullet('opensource-forker — 复制项目、剥离密钥和凭证（20+ 检测模式）'));
sections.push(bullet('opensource-sanitizer — 验证开源分支安全性，生成 PASS/FAIL 报告'));
sections.push(bullet('opensource-packager — 生成完整开源打包（README、LICENSE、CLAUDE.md 等）'));

sections.push(pageBreak());

// ============================================================
// Chapter 8 - Commands Usage
// ============================================================
sections.push(h1('第8章  命令（Commands）使用指南'));

sections.push(h2('8.1 命令速查表'));

sections.push(h3('日常开发'));
sections.push(code('/code-review    /build-fix    /test-coverage    /refactor-clean    /checkpoint'));

sections.push(h3('语言构建'));
sections.push(code('/go-build    /java-build    /rust-build    /cpp-build    /kotlin-build    /gradle-build    /flutter-build'));

sections.push(h3('语言审查'));
sections.push(code('/go-review   /java-review  /rust-review  /cpp-review  /kotlin-review  /flutter-review'));

sections.push(h3('语言测试'));
sections.push(code('/go-test     /java-test    /rust-test    /cpp-test    /kotlin-test    /flutter-test'));

sections.push(h3('工作流'));
sections.push(code('/plan    /feature-dev    /multi-plan    /multi-execute    /prp-plan    /prp-pr    /evolve'));

sections.push(h3('维护'));
sections.push(code('/update-codemaps    /update-docs    /harness-audit    /prune    /skill-health'));

sections.push(h3('会话'));
sections.push(code('/save-session    /resume-session    /sessions    /checkpoint'));

sections.push(h3('自动化'));
sections.push(code('/loop-start    /loop-status    /santa-loop    /model-route'));

sections.push(h2('8.2 推荐命令工作流'));
sections.push(boldP('功能开发：', '/plan → /feature-dev → /code-review → /test-coverage'));
sections.push(boldP('Bug 修复：', '/build-fix → /code-review → /test-coverage'));
sections.push(boldP('代码重构：', '/refactor-clean → /code-review → /test-coverage'));
sections.push(boldP('PR 提交：', '/prp-plan → /prp-implement → /prp-commit → /prp-pr'));

sections.push(pageBreak());

// ============================================================
// Chapter 9 - Hooks
// ============================================================
sections.push(h1('第9章  钩子（Hooks）配置指南'));

sections.push(h2('9.1 启用钩子系统'));
sections.push(p('ECC 的钩子系统需要在 settings.json 中配置才能生效。编辑 ~/.claude/settings.json，添加 hooks 配置：'));
sections.push(code('"hooks": {\n  "PreToolUse": [{\n    "matcher": "Bash",\n    "hooks": [{\n      "type": "command",\n      "command": "node ~/.claude/hooks/pre-bash-dispatcher.js"\n    }]\n  }],\n  "SessionStart": [{\n    "type": "command",\n    "command": "node ~/.claude/hooks/session-start.js"\n  }]\n}'));

sections.push(h2('9.2 可用的钩子事件'));
sections.push(makeTable(
  ['钩子事件', '触发时机', '用途'],
  [
    ['PreToolUse', '工具调用前', '参数验证、权限检查、操作拦截'],
    ['PostToolUse', '工具调用后', '日志记录、通知发送、状态更新'],
    ['SessionStart', '会话开始时', '环境初始化、上下文设置'],
    ['Stop', '会话结束时', '清理操作、状态保存'],
    ['PreCompact', '对话压缩前', '重要信息保存、检查点创建'],
    ['UserPromptSubmit', '用户提交时', '输入验证、敏感信息检测'],
  ],
));

sections.push(h2('9.3 钩子管理命令'));
sections.push(bullet('/hookify — 分析对话，发现可自动化的行为模式'));
sections.push(bullet('/hookify-list — 列出当前所有钩子'));
sections.push(bullet('/hookify-configure — 交互式配置钩子'));
sections.push(bullet('/hookify-help — 钩子系统帮助'));

sections.push(h2('9.4 GateGuard 安全机制'));
sections.push(p('GateGuard 在 Bash 命令执行前进行事实验证：'));
sections.push(bullet('Fact-Forcing：要求在执行命令前确认操作目的'));
sections.push(bullet('路径验证：确保操作范围在允许的目录内'));
sections.push(bullet('敏感操作检测：对高风险操作发出警告'));
sections.push(p('环境变量控制：'));
sections.push(code('ECC_GATEGUARD=off claude'));
sections.push(code('ECC_DISABLED_HOOKS="pre:bash:gateguard-fact-force" claude'));

sections.push(pageBreak());

// ============================================================
// Chapter 10 - Common Workflows
// ============================================================
sections.push(h1('第10章  常见工作流'));

sections.push(h2('10.1 新功能开发'));
sections.push(boldP('步骤 1 — 规划：', '使用 /plan 规划功能架构'));
sections.push(bullet('分析现有代码库结构和模式'));
sections.push(bullet('设计实现方案和数据流'));
sections.push(bullet('确定需要修改的文件和接口'));
sections.push(boldP('步骤 2 — 实现：', '使用 /feature-dev 实现功能'));
sections.push(bullet('按计划逐步实现功能代码'));
sections.push(bullet('遵循 ECC 规则中的编码风格和安全规范'));
sections.push(bullet('自动运行测试验证'));
sections.push(boldP('步骤 3 — 审查：', '使用 /code-review 审查代码'));
sections.push(bullet('触发对应语言的代码审查智能体'));
sections.push(bullet('按审查清单逐项检查，修复发现的问题'));
sections.push(boldP('步骤 4 — 验证：', '使用 /test-coverage 确保覆盖率'));
sections.push(bullet('检查新增代码的测试覆盖'));
sections.push(bullet('补充边界情况和异常路径测试'));

sections.push(h2('10.2 Bug 修复'));
sections.push(boldP('步骤 1：', '描述 Bug 现象，Claude Code 自动追踪代码执行路径，定位根因文件'));
sections.push(boldP('步骤 2：', '实施修复，遵循 coding-style 和 security 规则'));
sections.push(boldP('步骤 3：', '使用 /build-fix 确保编译通过'));
sections.push(boldP('步骤 4：', '使用 /code-review + /test-coverage 验证修复'));

sections.push(h2('10.3 代码重构'));
sections.push(boldP('步骤 1：', '使用 /refactor-clean 识别死代码和重复代码'));
sections.push(boldP('步骤 2：', '执行重构，遵循 patterns 规则中的设计模式'));
sections.push(boldP('步骤 3：', '使用 /code-review 审查，运行完整测试套件'));

sections.push(h2('10.4 PR 流水线'));
sections.push(boldP('完整流程：', '/prp-plan → /prp-implement → /prp-commit → /prp-pr'));
sections.push(bullet('/prp-plan — 创建 PR 计划'));
sections.push(bullet('/prp-implement — 实现 PR 代码修改'));
sections.push(bullet('/prp-commit — 生成规范提交信息'));
sections.push(bullet('/prp-pr — 创建 Pull Request 并生成描述'));

sections.push(h2('10.5 持续集成'));
sections.push(boldP('定时任务：', '使用 /loop-start 设置'));
sections.push(code('/loop-start 10m /build-fix      # 每 10 分钟尝试修复构建'));
sections.push(code('/loop-start 1h /test-coverage   # 每小时检查测试覆盖率'));

sections.push(pageBreak());

// ============================================================
// Chapter 11 - Best Practices
// ============================================================
sections.push(h1('第11章  最佳实践'));

sections.push(h2('11.1 日常使用'));
sections.push(bullet('代码修改后立即审查：每次修改完成后立即调用 /code-review'));
sections.push(bullet('善用语言专用智能体：Java 项目用 java-reviewer 而非通用 code-reviewer'));
sections.push(bullet('遵循 TDD 流程：开启 /tdd-workflow，先写测试再写实现'));
sections.push(bullet('定期更新：运行 /update-codemaps 和 /update-docs 保持文档同步'));

sections.push(h2('11.2 安全实践'));
sections.push(bullet('涉及用户输入、认证、API 端点时，务必调用 security-reviewer'));
sections.push(bullet('使用 /security-scan 定期扫描项目中的安全漏洞'));
sections.push(bullet('遵循 rules/ecc/<lang>/security.md 中的语言特定安全规范'));

sections.push(h2('11.3 性能优化'));
sections.push(bullet('遇到性能问题使用 performance-optimizer 智能体'));
sections.push(bullet('参考 rules/ecc/common/performance.md 中的性能规范'));
sections.push(bullet('数据库查询优化使用 database-reviewer 智能体'));

sections.push(h2('11.4 团队协作'));
sections.push(bullet('将 ECC 规则作为团队编码标准基线'));
sections.push(bullet('使用 /review-pr 进行标准化 PR 审查'));
sections.push(bullet('通过 /hookify 自动发现可标准化的团队工作流'));
sections.push(bullet('创建项目级规则补充团队特定规范'));

sections.push(h2('11.5 会话管理'));
sections.push(bullet('重要会话使用 /save-session 保存'));
sections.push(bullet('使用 /checkpoint 创建中间检查点'));
sections.push(bullet('定期使用 /prune 清理过期数据'));

sections.push(h2('11.6 自定义扩展'));
sections.push(bullet('使用 /skill-create 创建新技能'));
sections.push(bullet('使用 /skill-health 检查技能健康状态'));
sections.push(bullet('通过 /hookify 将重复操作转换为自动化钩子'));

sections.push(pageBreak());

// ============================================================
// Appendix
// ============================================================
sections.push(h1('附录'));

sections.push(h2('A. 完整技能列表（147个）'));

var skills = [
  'accessibility', 'agent-eval', 'agent-harness-construction', 'agent-introspection-debugging',
  'agent-payment-x402', 'agent-sort', 'agentic-engineering', 'ai-first-engineering',
  'ai-regression-testing', 'android-clean-architecture', 'api-connector-builder', 'api-design',
  'architecture-decision-records', 'article-writing', 'automation-audit-ops', 'autonomous-agent-harness',
  'autonomous-loops', 'backend-patterns', 'benchmark', 'blueprint',
  'brand-voice', 'browser-qa', 'bun-runtime', 'canary-watch',
  'carrier-relationship-management', 'claude-devfleet', 'click-path-audit', 'clickhouse-io',
  'code-tour', 'codebase-onboarding', 'coding-standards', 'compose-multiplatform-patterns',
  'configure-ecc', 'connections-optimizer', 'content-engine', 'content-hash-cache-pattern',
  'context-budget', 'continuous-agent-loop', 'continuous-learning', 'continuous-learning-v2',
  'cost-aware-llm-pipeline', 'council', 'cpp-coding-standards', 'cpp-testing',
  'crosspost', 'csharp-testing', 'customer-billing-ops', 'customs-trade-compliance',
  'dart-flutter-patterns', 'dashboard-builder', 'data-scraper-agent', 'database-migrations',
  'deep-research', 'defi-amm-security', 'deployment-patterns', 'design-system',
  'django-patterns', 'django-security', 'django-tdd', 'django-verification',
  'dmux-workflows', 'docker-patterns', 'documentation-lookup', 'dotnet-patterns',
  'e2e-testing', 'ecc-tools-cost-audit', 'email-ops', 'energy-procurement',
  'enterprise-agent-ops', 'eval-harness', 'evm-token-decimals', 'exa-search',
  'fal-ai-media', 'finance-billing-ops', 'foundation-models-on-device', 'frontend-patterns',
  'frontend-slides', 'gan-style-harness', 'gateguard', 'github-ops',
  'git-workflow', 'golang-patterns', 'golang-testing', 'google-workspace-ops',
  'healthcare-cdss-patterns', 'healthcare-emr-patterns', 'healthcare-eval-harness', 'healthcare-phi-compliance',
  'hermes-imports', 'hexagonal-architecture', 'hipaa-compliance', 'hookify-rules',
  'inventory-demand-planning', 'investor-materials', 'investor-outreach', 'iterative-retrieval',
  'java-coding-standards', 'jira-integration', 'jpa-patterns', 'knowledge-ops',
  'kotlin-coroutines-flows', 'kotlin-exposed-patterns', 'kotlin-ktor-patterns', 'kotlin-patterns',
  'kotlin-testing', 'laravel-patterns', 'laravel-plugin-discovery', 'laravel-security',
  'laravel-tdd', 'laravel-verification', 'lead-intelligence', 'liquid-glass-design',
  'llm-trading-agent-security', 'logistics-exception-management', 'manim-video', 'market-research',
  'mcp-server-patterns', 'messages-ops', 'nanoclaw-repl', 'nestjs-patterns',
  'nextjs-turbopack', 'nodejs-keccak256', 'nutrient-document-processing', 'openclaw-persona-forge',
  'opensource-pipeline', 'perl-patterns', 'perl-security', 'perl-testing',
  'plankton-code-quality', 'postgres-patterns', 'product-capability', 'product-lens',
  'production-scheduling', 'project-flow-ops', 'prompt-optimizer', 'python-patterns',
  'python-testing', 'pytorch-patterns', 'quality-nonconformance', 'ralphinho-rfc-pipeline',
  'regex-vs-llm-structured-text', 'remotion-video-creation', 'repo-scan', 'research-ops',
  'returns-reverse-logistics', 'rules-distill', 'rust-patterns', 'rust-testing',
  'safety-guard', 'santa-method', 'search-first', 'security-bounty-hunter',
  'security-review', 'security-scan', 'seo', 'skill-comply',
  'skill-stocktake', 'social-graph-ranker', 'springboot-patterns', 'springboot-security',
  'springboot-tdd', 'springboot-verification', 'strategic-compact', 'swift-actor-persistence',
  'swift-concurrency-6-2', 'swift-protocol-di-testing', 'swiftui-patterns', 'tdd-workflow',
  'team-builder', 'terminal-ops', 'token-budget-advisor', 'ui-demo',
  'unified-notifications-ops', 'verification-loop', 'video-editing', 'videodb',
  'visa-doc-translate', 'workspace-surface-audit', 'x-api',
];

var skillText = '';
for (var i = 0; i < skills.length; i++) {
  if (i > 0 && i % 5 === 0) skillText += '\n';
  skillText += (i + 1) + '. ' + skills[i] + '  ';
}
sections.push(p(skillText.trim()));

sections.push(h2('B. 完整智能体列表（48个）'));
var agents = [
  'a11y-architect', 'architect', 'build-error-resolver', 'chief-of-staff',
  'code-architect', 'code-explorer', 'code-reviewer', 'code-simplifier',
  'comment-analyzer', 'conversation-analyzer', 'cpp-build-resolver', 'cpp-reviewer',
  'csharp-reviewer', 'dart-build-resolver', 'database-reviewer', 'docs-lookup',
  'doc-updater', 'e2e-runner', 'flutter-reviewer', 'gan-evaluator',
  'gan-generator', 'gan-planner', 'go-build-resolver', 'go-reviewer',
  'harness-optimizer', 'healthcare-reviewer', 'java-build-resolver', 'java-reviewer',
  'kotlin-build-resolver', 'kotlin-reviewer', 'loop-operator', 'opensource-forker',
  'opensource-packager', 'opensource-sanitizer', 'performance-optimizer', 'planner',
  'pr-test-analyzer', 'python-reviewer', 'pytorch-build-resolver', 'refactor-cleaner',
  'rust-build-resolver', 'rust-reviewer', 'security-reviewer', 'seo-specialist',
  'silent-failure-hunter', 'tdd-guide', 'type-design-analyzer', 'typescript-reviewer',
];
var agentText = '';
for (var i = 0; i < agents.length; i++) {
  if (i > 0 && i % 4 === 0) agentText += '\n';
  agentText += (i + 1) + '. ' + agents[i] + '  ';
}
sections.push(p(agentText.trim()));

sections.push(h2('C. 完整命令列表（68个）'));
var commands = [
  'aside', 'auto-update', 'build-fix', 'checkpoint', 'code-review', 'cpp-build',
  'cpp-review', 'cpp-test', 'evolve', 'feature-dev', 'flutter-build', 'flutter-review',
  'flutter-test', 'gan-build', 'gan-design', 'go-build', 'go-review', 'go-test',
  'gradle-build', 'harness-audit', 'hookify', 'hookify-configure', 'hookify-help',
  'hookify-list', 'hookify-rules', 'instinct-export', 'instinct-import', 'instinct-status',
  'jira', 'kotlin-build', 'kotlin-review', 'kotlin-test', 'learn', 'learn-eval',
  'loop-start', 'loop-status', 'model-route', 'multi-backend', 'multi-execute',
  'multi-frontend', 'multi-plan', 'multi-workflow', 'plan', 'pm2', 'projects',
  'promote', 'prp-commit', 'prp-implement', 'prp-plan', 'prp-pr', 'prp-prd',
  'prune', 'python-review', 'quality-gate', 'refactor-clean', 'resume-session',
  'review-pr', 'rust-build', 'rust-review', 'rust-test', 'santa-loop', 'save-session',
  'sessions', 'setup-pm', 'skill-create', 'skill-health', 'skill-stocktake', 'test-coverage',
  'update-codemaps', 'update-docs',
];
var cmdText = '';
for (var i = 0; i < commands.length; i++) {
  if (i > 0 && i % 4 === 0) cmdText += '\n';
  cmdText += (i + 1) + '. /' + commands[i] + '  ';
}
sections.push(p(cmdText.trim()));

sections.push(h2('D. 关键路径参考'));
sections.push(makeTable(
  ['内容', '路径'],
  [
    ['ECC 安装状态', '~/.claude/ecc/install-state.json'],
    ['规则—通用', '~/.claude/rules/ecc/common/'],
    ['规则—中文', '~/.claude/rules/ecc/zh/'],
    ['规则—语言', '~/.claude/rules/ecc/<lang>/'],
    ['技能', '~/.claude/skills/ecc/'],
    ['智能体', '~/.claude/agents/'],
    ['命令', '~/.claude/commands/'],
    ['钩子', '~/.claude/hooks/'],
    ['市场源', '~/.claude/plugins/marketplaces/everything-claude-code/'],
    ['设置', '~/.claude/settings.json'],
  ],
));

sections.push(h2('E. 参考资源'));
sections.push(bullet('GitHub 仓库：https://github.com/affaan-m/everything-claude-code'));
sections.push(bullet('npm 包：https://www.npmjs.com/package/ecc-universal'));
sections.push(bullet('作者 Twitter：https://x.com/affaanmustafa'));
sections.push(bullet('Claude Code 文档：https://docs.claude.codes'));

sections.push(spacer(400));
sections.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200, after: 200 },
  border: { top: { style: BorderStyle.SINGLE, size: 2, color: 'e94560' } },
  children: [
    new TextRun({ text: '— 文档结束 —', size: 22, color: '999999', font: 'Microsoft YaHei', italics: true }),
  ],
}));

// ============================================================
// Generate .docx
// ============================================================

var doc = new Document({
  title: 'Everything-Claude-Code (ECC) 完整使用教程',
  description: 'ECC 2.0.0-rc.1 Full Profile 使用指南',
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
      },
    },
    children: sections,
  }],
});

var OUTPUT = 'D:/everything-claude-code/ECC完整使用教程.docx';

Packer.toBuffer(doc).then(function(buffer) {
  fs.writeFileSync(OUTPUT, buffer);
  console.log('Document generated: ' + OUTPUT);
  console.log('Size: ' + (buffer.length / 1024).toFixed(1) + ' KB');
}).catch(function(err) {
  console.error('Error generating document:', err);
  process.exit(1);
});
