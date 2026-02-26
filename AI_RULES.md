# AI Rules for Open Builder

This document outlines the technical stack and specific guidelines for using libraries within the Open Builder project. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

*   **Framework**: React 19 with TypeScript 5 for all application logic and UI components.
*   **Build Tool**: Vite 7 for fast development and optimized production builds.
*   **Styling**: Tailwind CSS v4 is used for all styling, providing a utility-first approach.
*   **UI Components**: shadcn/ui and Radix UI form the foundation for accessible and customizable UI elements.
*   **Code Sandbox**: Sandpack (from CodeSandbox) is integrated for real-time code editing and live preview functionality.
*   **State Management**: Zustand 5 is the chosen library for managing application state, including conversations and settings.
*   **Local Storage**: localforage is used for persistent client-side data storage, integrated with Zustand.
*   **Icons**: Lucide React provides a comprehensive set of customizable SVG icons.
*   **Markdown Rendering**: react-markdown with rehype-highlight is used for rendering Markdown content with syntax highlighting.
*   **File Operations**: JSZip and file-saver are used for client-side project archiving and download functionality.

## Library Usage Rules

*   **React & TypeScript**: All new components, hooks, and application logic must be written using React with TypeScript. Prioritize functional components and React Hooks.
*   **Tailwind CSS**: **Always use Tailwind CSS for styling.** Apply utility classes directly to elements. Avoid creating custom CSS files or using inline styles unless absolutely necessary and explicitly requested.
*   **shadcn/ui & Radix UI**: **Prefer shadcn/ui components** for common UI patterns (buttons, dialogs, inputs, etc.). If a specific `shadcn/ui` component needs modification, create a new component that wraps or extends it, rather than directly editing the `shadcn/ui` source files. Direct Radix UI usage is acceptable for lower-level primitives if `shadcn/ui` doesn't offer a suitable wrapper.
*   **Zustand**: Use Zustand for all global and complex local state management. Follow the existing patterns for defining stores and actions as seen in `src/store/conversation.ts` and `src/store/settings.ts`.
*   **Lucide React**: All icons used in the application must come from the `lucide-react` library.
*   **React Router**: If routing is required for new features or pages, `react-router` should be used, and routes should be defined within `src/App.tsx` as per project guidelines.
*   **File Structure**: New components should be placed in `src/components/`, and new pages in `src/pages/`. Utility functions or hooks should reside in `src/lib/` or `src/hooks/` respectively.