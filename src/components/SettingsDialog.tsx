import { useState, useEffect, useCallback } from "react";
import { Key, Globe, Cpu, Search, RefreshCw, AlertCircle } from "lucide-react";
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

const PROVIDER_CONFIGS = {
  custom: {
    name: "Custom / Scara AI",
    apiUrl: "",
    models: [],
  },
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
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  useEffect(() => {
    setWebSearchForm(webSearchSettings);
  }, [webSearchSettings]);

  const fetchModels = useCallback(async (url: string, key: string) => {
    if (!url || !key) return;
    
    setIsLoadingModels(true);
    setFetchError(null);
    
    try {
      let modelsUrl = url;
      
      // Derive models URL
      if (url.includes("/chat/completions")) {
        modelsUrl = url.replace(/\/chat\/completions\/?$/, "/models");
      } else if (!url.endsWith("/models") && !url.endsWith("/models/")) {
        const base = url.endsWith("/") ? url.slice(0, -1) : url;
        modelsUrl = `${base}/models`;
      }
      
      const res = await fetch(modelsUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Accept": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Eroare API: ${res.status}`);
      }
      
      const data = await res.json();
      let models: ModelOption[] = [];

      // Handle the specific structure: { object: "list", data: [...] }
      const rawData = data.data || data;
      
      if (Array.isArray(rawData)) {
        models = rawData.map((m: any) => ({
          id: m.id || (typeof m === 'string' ? m : ''),
          name: m.id || (typeof m === 'string' ? m : 'Unknown Model'),
        })).filter(m => m.id);
      }

      if (models.length === 0) {
        throw new Error("Nu s-au găsit modele în răspuns.");
      }

      setFetchedModels(models);
    } catch (err: any) {
      console.error("Fetch models failed:", err);
      setFetchError(err.message || "Eroare necunoscută");
      setFetchedModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  }, []);

  // Auto-fetch when dialog opens or credentials change
  useEffect(() => {
    if (isOpen && formData.apiKey && formData.apiUrl) {
      const timer = setTimeout(() => {
        fetchModels(formData.apiUrl, formData.apiKey);
      }, 600);
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
        model: config.models[0]?.id || formData.model,
      });
      setFetchedModels([]);
      setFetchError(null);
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
            <div className="flex items-center justify-between">
              <Label htmlFor="model">
                <Cpu size={16} className="inline mr-1" />
                Model / Agent
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
                    <SelectValue placeholder={isLoadingModels ? "Se încarcă..." : "Alege modelul"} />
                  </SelectTrigger>
                  <SelectContent>
                    {displayModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                    {displayModels.length === 0 && !isLoadingModels && (
                      <SelectItem value="none" disabled>Niciun model detectat</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Input
                className="w-1/3"
                placeholder="ID manual..."
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
            {fetchError && (
              <p className="text-[10px] text-destructive flex items-center gap-1">
                <AlertCircle size={10} /> {fetchError}
              </p>
            )}
            {fetchedModels.length > 0 && (
              <p className="text-[10px] text-green-600 font-medium">
                ✓ {fetchedModels.length} agenți detectați automat
              </p>
            )}
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
            Anulează
          </Button>
          <Button onClick={handleSave}>Salvează Setările</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}