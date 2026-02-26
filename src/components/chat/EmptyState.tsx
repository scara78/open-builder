import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  { icon: "💡", text: "Create a counter app" },
  { icon: "📝", text: "Create a todo app" },
  { icon: "📋", text: "Create a simple form" },
];

interface EmptyStateProps {
  onSelectSuggestion: (text: string) => void;
}

export function EmptyState({ onSelectSuggestion }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
      <img className="w-16 h-16 mb-4" src="/public/logo.svg" alt="logo" />
      <h3 className="text-base font-semibold mb-2">Start building your app</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        Tell me what kind of app you want, and I'll help you generate the complete code
      </p>
      <div className="space-y-2 w-full max-w-xs">
        {SUGGESTIONS.map(({ icon, text }) => (
          <Button
            key={text}
            variant="outline"
            className="w-full justify-start h-auto py-2.5 text-left"
            onClick={() => onSelectSuggestion(text)}
          >
            <span className="text-base mr-2">{icon}</span>
            <span className="text-sm">{text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}