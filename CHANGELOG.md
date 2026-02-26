# Changelog

This file records all significant changes to Open Builder.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and version numbers follow [Semantic Versioning](https://semver.org/lang/en/).

---

## [1.0.0] - 2026-02-26

### Added

- Complete AI Tool Call loop engine (`WebAppGenerator`) with support for up to 30 rounds of tool calls
- Built-in 8 file system tools: `init_project`, `manage_dependencies`, `list_files`, `read_files`, `write_file`, `patch_file`, `delete_file`, `search_in_files`
- Browser-based real-time code preview based on Sandpack, supporting 20+ project templates
- Multi-session management: create, switch, and delete conversations, with history persisted via localforage
- Image input support (multimodal), allowing upload of screenshots or design mockups
- Streaming output support, displaying AI generation process in real-time
- Extended Thinking / Reasoning support (DeepSeek-R1, Claude 3.7, etc.)
- Web search integration (Tavily API), supporting `web_search` and `web_reader` tools
- Jina Reader as an automatic fallback for web reading
- Tool call visualization cards (`ToolCallCard`), displaying status and results of each tool call
- One-click project download as ZIP file
- Mobile-responsive layout with embedded preview on mobile
- Settings dialog: API Key, API URL, model name, Tavily configuration
- All configurations saved in browser localStorage, not uploaded to server

### Tech Stack

- React 19 + TypeScript 5
- Vite 7 + Tailwind CSS v4
- shadcn/ui + Radix UI
- Zustand 5 state management

## [0.1.0] - 2026-02-24

### Added

- Project initialization based on Vite + React TypeScript template
- Basic `WebAppGenerator` class implementing OpenAI Tool Call loop
- `ChatInterface` chat interface component
- `CodeViewer` code viewer (editor + Sandpack preview)
- `SettingsDialog` settings dialog
- Support for OpenAI compatible API (OpenAI, DeepSeek, etc.)
- Basic file operation tools: `write_file`, `read_files`, `list_files`, `delete_file`

[1.0.0]: https://github.com/Amery2010/open-builder/compare/v0.3.0...v1.0.0
[0.1.0]: https://github.com/Amery2010/open-builder/releases/tag/v0.1.0