# Contribution Guide

Thank you for your interest in Open Builder! We welcome any form of contribution, including bug reports, feature suggestions, documentation improvements, and code submissions.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)

---

## Code of Conduct

By participating in this project, you agree to abide by the following basic principles:

- Respect all participants and maintain friendly and constructive communication
- Accept constructive criticism and focus on what's best for the project
- Do not post any discriminatory, harassing, or inappropriate content

---

## How to Contribute

### Report Bugs

1. First search [Issues](https://github.com/your-username/open-builder/issues) to confirm the issue hasn't been reported
2. Create a new Issue using the **Bug Report** template
3. Provide the following information:
   - Operating system and browser version
   - Steps to reproduce (as detailed as possible)
   - Expected behavior vs actual behavior
   - Relevant screenshots or error logs

### Submit Feature Suggestions

1. First search Issues to confirm the suggestion hasn't been proposed
2. Create a new Issue using the **Feature Request** template
3. Clearly describe the use case and expected outcome of the feature

### Contribute Code

1. Fork this repository
2. Create your feature branch based on the `main` branch
3. Complete development and ensure tests pass
4. Submit a Pull Request

---

## Development Environment Setup

### Prerequisites

- Node.js 18+ (recommended to use [nvm](https://github.com/nvm-sh/nvm) for version management)
- Git

### Local Running

```bash
# 1. Fork and clone repository
git clone https://github.com/your-username/open-builder.git
cd open-builder

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` and fill in your API Key in settings to start debugging.

### Available Commands

```bash
npm run dev      # Start development server (hot reload)
npm run build    # Build production version
npm run preview  # Preview production build
npm run lint     # TypeScript type checking
```

---

## Project Structure

Before contributing, it's recommended to understand the core modules of the project:

```
src/
├── lib/generator.ts      # Core engine: WebAppGenerator (Tool Call loop)
├── lib/tavily.ts         # Web search tools
├── lib/settings.ts       # Settings persistence
├── store/conversation.ts # Zustand conversation state management
├── hooks/useGenerator.ts # Hook connecting engine to UI
└── components/           # UI components
```

**When modifying the core engine** (`generator.ts`), please be extra cautious as it directly affects the stability of AI tool calls.

---

## Commit Guidelines

This project uses the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

```
<type>(<scope>): <short description>

[optional detailed description]

[optional related Issue]
```

### Commit Types

| Type | Description |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code formatting (does not affect functionality) |
| `refactor` | Refactoring (no new features, no bug fixes) |
| `perf` | Performance optimization |
| `chore` | Build process or auxiliary tool changes |

### Examples

```bash
feat(generator): add search_in_files tool support for regex search
fix(chat): fix mobile message list scrolling issue
docs: update README model configuration instructions
refactor(store): migrate conversation persistence logic to Zustand middleware
```

---

## Pull Request Process

1. **Create Branch**

   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-123
   ```

2. **Development and Commit**

   Keep each commit focused on a single change and follow commit guidelines.

3. **Ensure Code Quality**

   ```bash
   npm run lint   # Ensure no TypeScript errors
   npm run build  # Ensure build succeeds
   ```

4. **Push and Create PR**

   ```bash
   git push origin feat/your-feature-name
   ```

   Create a Pull Request on GitHub, filling in:
   - Brief description of changes
   - Related Issue (if any)
   - Testing method

5. **Wait for Review**

   Maintainers will review your PR as soon as possible. Please be patient and make modifications based on feedback.

### PR Notes

- Keep PRs focused, with one PR doing one thing
- Ensure PR is based on the latest `main` branch (rebase if there are conflicts)
- Do not include formatting changes unrelated to the feature in PRs

---

## Code Style

- Use TypeScript, avoid using `any` (add comments explaining why if necessary)
- Use functional components, prefer React Hooks
- File naming: components use PascalCase, utility functions use camelCase
- Keep code concise, avoid over-abstraction
- When adding new tools, add definitions to the `BUILTIN_TOOLS` array in `generator.ts` and add handling logic in the `executeTool` switch

---

## Need Help?

If you encounter any issues during contribution, feel free to:

- Leave a comment on the relevant Issue
- Create a new Issue describing your problem

Thank you again for your contribution!