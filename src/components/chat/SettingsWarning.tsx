import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SettingsWarningProps {
  onOpenSettings: () => void;
}

export function SettingsWarning({ onOpenSettings }: SettingsWarningProps) {
  return (
    <Card className="p-4 bg-yellow-50 border-yellow-200">
      <div className="flex items-start gap-3">
        <Settings size={20} className="text-yellow-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-yellow-900 text-sm mb-1">AI Model Configuration Required</h3>
          <p className="text-xs text-yellow-800 mb-3">Please configure API Key and model settings before you can start</p>
          <Button onClick={onOpenSettings} size="sm" className="h-8 bg-yellow-600 hover:bg-yellow-700">
            Open Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}