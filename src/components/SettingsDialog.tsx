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

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
  webSearchSettings: WebSearchSettings;
  onSaveWebSearch: (settings: WebSearchSettings) => void;
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
  const [webSearchForm, setWebSearchForm] =
    useState<WebSearchSettings>(webSearchSettings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  useEffect(() => {
    setWebSearchForm(webSearchSettings);
  }, [webSearchSettings]);

  const handleSave = () => {
    onSave(formData);
    onSaveWebSearch(webSearchForm);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90dvh] flex flex-col">
        <DialogHeader className="px-2">
          <DialogTitle>AI Model Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-2 py-4 overflow-y-auto flex-1 min-h-0">
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
            <p className="text-xs text-muted-foreground">
              Your API key, will be saved in browser local storage
            </p>
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
              placeholder="https://openrouter.ai/api/v1/chat/completions"
            />
            <p className="text-xs text-muted-foreground">
              OpenAI compatible API endpoint
            </p>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label htmlFor="model">
              <Cpu size={16} className="inline mr-1" />
              Model Name
            </Label>
            <Input
              id="model"
              type="text"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              placeholder="qwen/qwen3.5-flash-02-23"
            />
            <p className="text-xs text-muted-foreground">
              Name of the AI model, such as gpt-5.3-codex, deepseek-chat, etc.
            </p>
          </div>

          {/* ── Web Search Settings ── */}
          <div className="border-t border-border/60 pt-4 mt-2">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-3">
              <Search size={16} />
              Web Search (Tavily)
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              After configuration, AI will be able to search the web and read web content
            </p>

            {/* Tavily API Key */}
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
              <p className="text-xs text-muted-foreground">
                Optional. Enable web search and web reading features after configuration
              </p>
            </div>

            {/* Tavily API URL */}
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
              <p className="text-xs text-muted-foreground">
                Optional. Use Tavily's official API address by default
              </p>
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
