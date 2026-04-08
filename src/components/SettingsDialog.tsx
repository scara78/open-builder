import { useState, useEffect } from "react";
import { Key, Globe, Cpu, Search } from "lucide-react";
import { AISettings, WebSearchSettings } from "../store/settings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
  webSearchSettings: WebSearchSettings;
  onSaveWebSearch: (settings: WebSearchSettings) => void;
}

// Provider configurations
const PROVIDER_CONFIGS = {
  openai: {
    name: "OpenAI",
    apiUrl: "https://api.openai.com/v1/chat/completions",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    ],
  },
  openrouter: {
    name: "OpenRouter",
    apiUrl: "https://openrouter.ai/api/v1/chat/completions",
    models: [
      { id: "qwen/qwen3.5-flash-02-23", name: "Qwen 3.5 Flash" },
      { id: "deepseek/deepseek-v3.2", name: "DeepSeek V3.2" },
    ],
  },
  deepseek: {
    name: "DeepSeek",
    apiUrl: "https://api.deepseek.com/v1/chat/completions",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat" },
      { id: "deepseek-reasoner", name: "DeepSeek Reasoner" },
    ],
  },
  custom: {
    name: "Custom",
    apiUrl: "",
    models: [],
  }
};

export function SettingsDialog({
  isOpen,
  onClose,
  settings,
  onSave,
  webSearchSettings,
  onSaveWebSearch,
}: SettingsDialogProps) {
  const [formData, setFormData] = useState<AISettings>(settings);
  const [webSearchForm, setWebSearchForm] =
    useState<WebSearchSettings>(webSearchSettings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  useEffect(() => {
    setWebSearchForm(webSearchSettings);
  }, [webSearchSettings]);

  const handleProviderChange = (provider: string) => {
    const config = PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS];
    if (config) {
      setFormData({
        ...formData,
        provider,
        apiUrl: config.apiUrl,
        model: config.models[0]?.id || formData.model,
      });
    }
  };

  const handleSave = () => {
    onSave(formData);
    onSaveWebSearch(webSearchForm);
    onClose();
  };

  const currentProviderConfig = PROVIDER_CONFIGS[formData.provider as keyof typeof PROVIDER_CONFIGS];
  const displayModels = currentProviderConfig?.models || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90dvh] flex flex-col">
        <DialogHeader className="px-2">
          <DialogTitle>AI Model Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-2 py-4 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-2">
            <Label htmlFor="provider">
              <Cpu size={16} className="inline mr-1" />
              AI Provider
            </Label>
            <Select value={formData.provider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROVIDER_CONFIGS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">
              <Key size={16} className="inline mr-1" />
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={formData.apiKey}
              onChange={(e) =>
                setFormData({ ...formData, apiKey: e.target.value })
              }
              placeholder="sk-..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiUrl">
              <Globe size={16} className="inline mr-1" />
              API URL
            </Label>
            <Input
              id="apiUrl"
              type="text"
              value={formData.apiUrl}
              onChange={(e) =>
                setFormData({ ...formData, apiUrl: e.target.value })
              }
              placeholder="https://api.your-provider.com/v1/chat/completions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">
              <Cpu size={16} className="inline mr-1" />
              Model ID
            </Label>
            <div className="flex gap-2">
              {displayModels.length > 0 ? (
                <div className="flex-1">
                  <Select 
                    value={formData.model} 
                    onValueChange={(model) => setFormData({ ...formData, model })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {displayModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              <Input
                className={displayModels.length > 0 ? "w-1/2" : "w-full"}
                placeholder="Enter model ID (e.g. gpt-4o)"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t border-border/60 pt-4 mt-2">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-3">
              <Search size={16} />
              Web Search (Tavily)
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="tavilyApiKey">
                <Key size={16} className="inline mr-1" />
                Tavily API Key
              </Label>
              <Input
                id="tavilyApiKey"
                type="password"
                value={webSearchForm.tavilyApiKey}
                onChange={(e) =>
                  setWebSearchForm({
                    ...webSearchForm,
                    tavilyApiKey: e.target.value,
                  })
                }
                placeholder="tvly-..."
              />
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="tavilyApiUrl">
                <Globe size={16} className="inline mr-1" />
                Tavily API URL
              </Label>
              <Input
                id="tavilyApiUrl"
                type="text"
                value={webSearchForm.tavilyApiUrl}
                onChange={(e) =>
                  setWebSearchForm({
                    ...webSearchForm,
                    tavilyApiUrl: e.target.value,
                  })
                }
                placeholder="https://api.tavily.com"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}