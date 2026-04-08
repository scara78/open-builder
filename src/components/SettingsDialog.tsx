import { useState, useEffect, useCallback } from "react";
import { Key, Globe, Cpu, Search, RefreshCw } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
  webSearchSettings: WebSearchSettings;
  onSaveWebSearch: (settings: WebSearchSettings) => void;
}

interface ModelOption {
  id: string;
  name: string;
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
    name: "Custom / Local",
    apiUrl: "http://localhost:11434/v1/chat/completions",
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
  const [fetchedModels, setFetchedModels] = useState<ModelOption[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  useEffect(() => {
    setWebSearchForm(webSearchSettings);
  }, [webSearchSettings]);

  const fetchModels = useCallback(async (url: string, key: string) => {
    if (!url || !key) return;
    
    setIsLoadingModels(true);
    try {
      // Derive models URL from chat completions URL (usually /v1/models)
      const modelsUrl = url.replace(/\/chat\/completions\/?$/, "/models");
      
      const res = await fetch(modelsUrl, {
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch models");
      
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        const models = data.data.map((m: any) => ({
          id: m.id,
          name: m.id,
        }));
        setFetchedModels(models);
      }
    } catch (err) {
      console.error("Error fetching models:", err);
      setFetchedModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  }, []);

  // Auto-fetch models when API key or URL changes and dialog is open
  useEffect(() => {
    if (isOpen && formData.apiKey && formData.apiUrl) {
      const timer = setTimeout(() => {
        fetchModels(formData.apiUrl, formData.apiKey);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, formData.apiUrl, formData.apiKey, fetchModels]);

  const handleProviderChange = (provider: string) => {
    const config = PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS];
    if (config) {
      setFormData({
        ...formData,
        provider,
        apiUrl: config.apiUrl,
        model: config.models[0]?.id || "",
      });
      setFetchedModels([]);
    }
  };

  const handleSave = () => {
    onSave(formData);
    onSaveWebSearch(webSearchForm);
    onClose();
  };

  const currentProviderConfig = PROVIDER_CONFIGS[formData.provider as keyof typeof PROVIDER_CONFIGS];
  const displayModels = fetchedModels.length > 0 ? fetchedModels : (currentProviderConfig?.models || []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90dvh] flex flex-col">
        <DialogHeader className="px-2">
          <DialogTitle>AI Model Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-2 py-4 overflow-y-auto flex-1 min-h-0">
          {/* Provider Selection */}
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

          {/* API Key */}
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

          {/* API URL */}
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
              placeholder={currentProviderConfig?.apiUrl || "API endpoint URL"}
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="model">
                <Cpu size={16} className="inline mr-1" />
                Model
              </Label>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => fetchModels(formData.apiUrl, formData.apiKey)}
                disabled={isLoadingModels || !formData.apiKey}
              >
                <RefreshCw size={12} className={cn(isLoadingModels && "animate-spin")} />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Select 
                  value={formData.model} 
                  onValueChange={(model) => setFormData({ ...formData, model })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingModels ? "Loading models..." : "Select model"} />
                  </SelectTrigger>
                  <SelectContent>
                    {displayModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                    {displayModels.length === 0 && !isLoadingModels && (
                      <SelectItem value="manual" disabled>No models found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Input
                className="w-1/3"
                placeholder="Or type ID..."
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {fetchedModels.length > 0 
                ? `Found ${fetchedModels.length} models from API` 
                : "Select from list or enter model ID manually"}
            </p>
          </div>

          {/* ── Web Search Settings ── */}
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