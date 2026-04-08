import { useState, useEffect, useRef } from "react";
import { Key, Globe, Cpu, Search, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
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
    models: [] as ModelOption[],
  },
  openai: {
    name: "OpenAI",
    apiUrl: "https://api.openai.com/v1/chat/completions",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    ] as ModelOption[],
  },
  openrouter: {
    name: "OpenRouter",
    apiUrl: "https://openrouter.ai/api/v1/chat/completions",
    models: [
      { id: "qwen/qwen3.5-flash-02-23", name: "Qwen 3.5 Flash" },
      { id: "deepseek/deepseek-v3.2", name: "DeepSeek V3.2" },
    ] as ModelOption[],
  },
  deepseek: {
    name: "DeepSeek",
    apiUrl: "https://api.deepseek.com/v1/chat/completions",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat" },
      { id: "deepseek-reasoner", name: "DeepSeek Reasoner" },
    ] as ModelOption[],
  },
};

function deriveModelsUrl(apiUrl: string): string {
  if (!apiUrl) return "";
  if (apiUrl.includes("/chat/completions")) {
    return apiUrl.replace(/\/chat\/completions\/?$/, "/models");
  }
  if (apiUrl.endsWith("/models") || apiUrl.endsWith("/models/")) {
    return apiUrl;
  }
  const base = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
  return `${base}/models`;
}

export function SettingsDialog({
  isOpen,
  onClose,
  settings,
  onSave,
  webSearchSettings,
  onSaveWebSearch,
}: SettingsDialogProps) {
  const [formData, setFormData] = useState<AISettings>(settings);
  const [webSearchForm, setWebSearchForm] = useState<WebSearchSettings>(webSearchSettings);
  const [fetchedModels, setFetchedModels] = useState<ModelOption[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Use refs to avoid stale closures in the fetch function
  const apiUrlRef = useRef(formData.apiUrl);
  const apiKeyRef = useRef(formData.apiKey);
  apiUrlRef.current = formData.apiUrl;
  apiKeyRef.current = formData.apiKey;

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  useEffect(() => {
    setWebSearchForm(webSearchSettings);
  }, [webSearchSettings]);

  const doFetch = async (url: string, key: string) => {
    if (!url || !key) {
      setFetchError("Introdu API URL și API Key mai întâi.");
      return;
    }

    const modelsUrl = deriveModelsUrl(url);
    setIsLoadingModels(true);
    setFetchError(null);
    setFetchedModels([]);

    try {
      const res = await fetch(modelsUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
      }

      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("Răspunsul nu este JSON valid.");
      }

      // Support { object: "list", data: [...] } and plain arrays
      const raw: any[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

      if (raw.length === 0) {
        throw new Error("Nu s-au găsit modele în răspuns.");
      }

      const models: ModelOption[] = raw
        .map((m: any) => ({
          id: typeof m === "string" ? m : String(m?.id ?? ""),
          name: typeof m === "string" ? m : String(m?.id ?? ""),
        }))
        .filter((m) => m.id);

      setFetchedModels(models);
    } catch (err: any) {
      setFetchError(err.message ?? "Eroare necunoscută");
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Auto-fetch when dialog opens (with debounce)
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      doFetch(apiUrlRef.current, apiKeyRef.current);
    }, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Re-fetch when URL or key changes (debounced)
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      doFetch(formData.apiUrl, formData.apiKey);
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.apiUrl, formData.apiKey]);

  const handleProviderChange = (provider: string) => {
    const config = PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS];
    if (!config) return;
    setFormData((prev) => ({
      ...prev,
      provider,
      apiUrl: config.apiUrl || prev.apiUrl,
      model: config.models[0]?.id || prev.model,
    }));
    setFetchedModels([]);
    setFetchError(null);
  };

  const handleSave = () => {
    onSave(formData);
    onSaveWebSearch(webSearchForm);
    onClose();
  };

  const currentProviderConfig = PROVIDER_CONFIGS[formData.provider as keyof typeof PROVIDER_CONFIGS];
  const displayModels =
    fetchedModels.length > 0
      ? fetchedModels
      : (currentProviderConfig?.models ?? []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90dvh] flex flex-col">
        <DialogHeader className="px-2">
          <DialogTitle>AI Model Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-2 py-4 overflow-y-auto flex-1 min-h-0">
          {/* Provider */}
          <div className="space-y-2">
            <Label>
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
              onChange={(e) => setFormData((p) => ({ ...p, apiKey: e.target.value }))}
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
              onChange={(e) => setFormData((p) => ({ ...p, apiUrl: e.target.value }))}
              placeholder="https://ruter1.scara.ovh/v1/chat/completions"
            />
            <p className="text-[10px] text-muted-foreground">
              Modele detectate automat din: <span className="font-mono">{deriveModelsUrl(formData.apiUrl) || "—"}</span>
            </p>
          </div>

          {/* Model selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                <Cpu size={16} className="inline mr-1" />
                Model / Agent
              </Label>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                title="Reîncarcă lista de modele"
                disabled={isLoadingModels}
                onClick={() => doFetch(formData.apiUrl, formData.apiKey)}
              >
                <RefreshCw size={12} className={cn(isLoadingModels && "animate-spin")} />
              </Button>
            </div>

            {/* Status messages */}
            {isLoadingModels && (
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <RefreshCw size={10} className="animate-spin" /> Se detectează agenții...
              </p>
            )}
            {fetchError && !isLoadingModels && (
              <p className="text-[10px] text-destructive flex items-center gap-1">
                <AlertCircle size={10} /> {fetchError}
              </p>
            )}
            {fetchedModels.length > 0 && !isLoadingModels && (
              <p className="text-[10px] text-green-600 flex items-center gap-1">
                <CheckCircle2 size={10} /> {fetchedModels.length} agenți detectați automat
              </p>
            )}

            {/* Dropdown + manual input */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  value={formData.model}
                  onValueChange={(model) => setFormData((p) => ({ ...p, model }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingModels ? "Se încarcă..." : "Alege agentul"} />
                  </SelectTrigger>
                  <SelectContent>
                    {displayModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                    {displayModels.length === 0 && !isLoadingModels && (
                      <SelectItem value="_none" disabled>
                        Niciun agent detectat
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Input
                className="w-2/5"
                placeholder="ID manual..."
                value={formData.model}
                onChange={(e) => setFormData((p) => ({ ...p, model: e.target.value }))}
              />
            </div>
          </div>

          {/* Web Search */}
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
                  setWebSearchForm((p) => ({ ...p, tavilyApiKey: e.target.value }))
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
                  setWebSearchForm((p) => ({ ...p, tavilyApiUrl: e.target.value }))
                }
                placeholder="https://api.tavily.com"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button onClick={handleSave}>Salvează Setările</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}