import {
  WebAppGenerator,
  GeneratorOptions,
  GeneratorEvents,
  ProjectFiles,
  ToolDefinition,
} from "./generator";

/**
 * OpenAI compatible client configuration
 */
export interface OpenAIClientConfig {
  /** API endpoint URL */
  apiUrl?: string;
  /** API key */
  apiKey: string;
  /** Model name */
  model?: string;
  /** Whether to enable streaming output */
  stream?: boolean;
}

/**
 * Create an OpenAI compatible Web App generator
 */
export function createOpenAIGenerator(
  config: OpenAIClientConfig,
  events?: GeneratorEvents,
  initialFiles?: ProjectFiles,
  customTools?: ToolDefinition[],
  customToolHandler?: (name: string, args: unknown) => string | Promise<string>,
): WebAppGenerator {
  const options: GeneratorOptions = {
    apiUrl: config.apiUrl || "https://api.openai.com/v1/chat/completions",
    apiKey: config.apiKey,
    model: config.model || "gpt-5.3-codex",
    stream: config.stream ?? true,
    initialFiles,
    customTools,
    customToolHandler,
  };

  return new WebAppGenerator(options, events);
}

/**
 * Simplified generation function - for single code generation
 */
export async function generateWithOpenAI(
  prompt: string,
  config: OpenAIClientConfig,
  currentFiles?: ProjectFiles,
): Promise<{ code: string; files: ProjectFiles }> {
  let generatedText = "";
  let finalFiles: ProjectFiles = {};

  const generator = createOpenAIGenerator(
    config,
    {
      onText: (delta) => {
        generatedText += delta;
      },
      onFileChange: (files) => {
        finalFiles = files;
      },
      onError: (error) => {
        console.error("Generation error:", error);
      },
    },
    currentFiles,
  );

  const result = await generator.generate(prompt);

  // If there is an App.tsx file, return its content as the main code
  const mainCode = finalFiles["src/App.tsx"] || finalFiles["App.tsx"] || "";

  return {
    code: mainCode,
    files: finalFiles,
  };
}