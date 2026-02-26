<div align="center">

# Open Builder

**AI-Powered Web App Generator — Describe in natural language, instantly generate a complete, runnable project**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Deployment Guide](#deployment) · [Quick Start](#quick-start) · [Features](#features) · [Architecture](#architecture) · [Contribution Guide](CONTRIBUTING.md)

</div>

---

## Introduction

Open Builder is an AI-driven web app generator that runs entirely in the browser. You simply describe the app you want to build in natural language, and the AI will automatically create, modify, and delete files through a Tool Call loop in an in-memory file system, with real-time preview of the results through [Sandpack](https://sandpack.codesandbox.io/).

The entire process requires no backend server, with all computation done in the browser. Your API Key is only stored in the browser's local storage and is never uploaded to any server.

> Compatible with any OpenAI Chat Completions API, including OpenAI, Anthropic Claude, DeepSeek, Qwen, and other major model services.

---

## Demo

![screenshot](/public/images/screenshot.jpg)

[Demo Site](https://builder.u14.app)

---

## Features

### Core Capabilities

- **Natural Language to Code** — Describe your idea, and AI automatically plans and generates a complete project structure
- **Real-time Preview** — Browser-based sandbox with instant rendering of code changes
- **Multi-framework Support** — Supports React, Vue, Svelte, Angular, SolidJS, Astro, and 20+ templates
- **Smart File Operations** — AI precisely modifies files through `patch_file`, avoiding unnecessary full rewrites
- **Dependency Management** — AI can automatically modify `package.json` and trigger dependency reinstallation

### Interactive Experience

- **Multi-session Management** — Supports creating, switching, and deleting multiple independent conversations, with persistent history
- **Image Input** — Supports uploading screenshots or design mockups, with AI generating corresponding interfaces
- **Streaming Output** — Real-time display of AI thinking process and code generation progress
- **Extended Thinking** — Supports Extended Thinking / Reasoning mode (DeepSeek-R1, Claude 4.6, etc.)
- **One-click Download** — Package the generated project as a ZIP file for local download
- **Mobile Adaptation** — Responsive layout with embedded preview of generated apps on mobile

### Web Search (Optional)

- Integrated with [Tavily](https://tavily.com) API, allowing AI to search the web for up-to-date information
- Supports web content reading, with automatic fallback to [Jina Reader](https://jina.ai/reader/) as a backup solution

---

## Quick Start

### Prerequisites

- Node.js 20+ or [Bun](https://bun.sh)
- Any OpenAI compatible API Key

### Installation and Running

```bash
# Clone repository
git clone https://github.com/Amery2010/open-builder.git
cd open-builder

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open your browser and visit `http://localhost:5173`, then click the settings icon in the top right to configure your API Key to get started.

### Configuration Guide

Click the settings button in the top right corner of the interface to fill in the following information:

| Configuration | Description | Example |
| -------------- | --------------------- | -------------------------------------------- |
| API Key | Your AI service API key | `sk-...` |
| API URL | OpenAI compatible endpoint | `https://api.openai.com/v1/chat/completions` |
| Model Name | Model ID to use | `gpt-5.3-codex`, `deepseek-chat` |
| Tavily API Key | (Optional) Web search feature | `tvly-...` |

> All configurations are saved in browser `localStorage` and never leave your device.

---

## Architecture

```
open-builder/
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx      # Main chat interface
│   │   ├── CodeViewer.tsx         # Code viewer (editor + preview)
│   │   ├── SettingsDialog.tsx     # Settings dialog
│   │   └── chat/                  # Chat sub-components
│   │       ├── ChatHeader.tsx     # Top bar (session switching, settings)
│   │       ├── ChatInput.tsx      # Input box (supports image upload)
│   │       ├── MessageBubble.tsx  # Message bubbles
│   │       ├── ToolCallCard.tsx   # Tool call visualization cards
│   │       ├── MobilePreview.tsx  # Mobile embedded preview
│   │       └── SessionList.tsx    # Session list sidebar
│   ├── hooks/
│   │   ├── useAppState.ts         # Application state aggregation
│   │   ├── useGenerator.ts        # AI generator Hook
│   │   ├── useMergedMessages.ts   # Message merging (merge consecutive tool calls)
│   │   └── useIsMobile.ts         # Mobile detection
│   ├── lib/
│   │   ├── generator.ts           # Core: WebAppGenerator engine
│   │   ├── tavily.ts              # Web search tools (Tavily + Jina)
│   │   └── client.ts              # API client wrapper
│   ├── store/
│   │   ├── conversation.ts        # Zustand conversation state (with persistence)
│   │   └── settings.ts            # Zustand settings state (with persistence)
│   └── types/
│       └── index.ts               # Global type definitions
```

### Core Engine: WebAppGenerator

[src/lib/generator.ts](src/lib/generator.ts) is the core of the entire project, implementing a complete AI Tool Call loop engine:

```
User message → AI planning → Tool call → Tool execution → Return result → AI continue/finish
                                    ↓
                              In-memory file system
                                    ↓
                           Sandpack real-time preview
```

Built-in tool list:

| Tool | Description |
| --------------------- | ---------------------------------- |
| `init_project` | Initialize Sandpack project template |
| `manage_dependencies` | Modify package.json to manage dependencies |
| `list_files` | List all project files |
| `read_files` | Batch read file contents |
| `write_file` | Create or overwrite files |
| `patch_file` | Precise search-replace patches (recommended for small changes) |
| `delete_file` | Delete files |
| `search_in_files` | Regex search in files |
| `web_search` | Web search (requires Tavily configuration) |
| `web_reader` | Read web page content |

### Tech Stack

| Category | Technology |
| ------------- | --------------------------------- |
| Framework | React 19 + TypeScript 5 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Code Sandbox | Sandpack (CodeSandbox) |
| State Management | Zustand 5 |
| Local Storage | localforage |
| Icons | Lucide React |
| Markdown Rendering | react-markdown + rehype-highlight |

---

## Supported Models

Open Builder is compatible with all OpenAI Chat Completions API:

| Provider | Recommended Models | API URL |
| -------- | ------------------------------------ | -------------------------------------------------------------------- |
| OpenAI | `gpt-5.3-codex`, `gpt-5.2` | `https://api.openai.com/v1/chat/completions` |
| DeepSeek | `deepseek-chat`, `deepseek-reasoner` | `https://api.deepseek.com/v1/chat/completions` |
| Qwen | `qwen-3.5`, `qwen3-coder-plus` | `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions` |
| Moonshot AI | `kimi-k2.5` | `https://api.moonshot.cn/v1/chat/completions` |
| Zhipu AI | `glm-5` | `https://open.bigmodel.cn/api/paas/v4/chat/completions` |

> It is recommended to use models that support Function Calling for the best results.

---

## Deployment

### Build Production Version

```bash
pnpm build
# Output to dist/ directory
```

### Deploy to GitHub Pages

This project is configured with GitHub Actions, pushing a version tag will automatically build and deploy:

```bash
git tag v1.0.0
git push origin v1.0.0
```

See [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAmery2010%2Fopen-builder)

Or deploy manually: Import GitHub repository, select `Vite` as framework preset, build command `pnpm run build`, output directory `dist`, no additional configuration needed.

### Deploy to Cloudflare Worker

[![Deploy to Cloudflare Worker](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Amery2010/open-builder)

Or deploy manually:

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → Create → Worker → Connect to Git
2. Select `open-builder` repository, with the following build configuration:

| Configuration | Value |
| ------------ | ---------------- |
| Build Command | `pnpm run build` |
| Output Directory | `dist` |
| Node.js Version | `20` |

### Deploy to Netlify

Import repository directly, build command `pnpm run build`, output directory `dist`, no additional configuration needed.

---

## Contribution

Welcome to submit Issues and Pull Requests! Please read the [Contribution Guide](CONTRIBUTING.md) first.

---

## License

[GPLv3 License](LICENSE) © 2026 Open Builder Contributors