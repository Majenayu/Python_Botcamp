import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Volume2, Delete } from 'lucide-react';

interface OutputPanelProps {
  recognizedText: string;
  recentLetters: string[];
  onClear: () => void;
  onSpeak: () => void;
  onBackspace: () => void;
  isSpeaking: boolean;
}

export default function OutputPanel({ 
  recognizedText, 
  recentLetters, 
  onClear, 
  onSpeak,
  onBackspace,
  isSpeaking 
}: OutputPanelProps) {
  return (
    <Card className="flex flex-col h-full">
      <div className="p-4 border-b border-card-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recognized Text</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onBackspace}
              disabled={!recognizedText}
              data-testid="button-backspace"
            >
              <Delete className="w-4 h-4 mr-2" />
              Backspace
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onSpeak}
              disabled={!recognizedText || isSpeaking}
              data-testid="button-speak"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Speak
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onClear}
              disabled={!recognizedText}
              data-testid="button-clear"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 min-h-0">
        <ScrollArea className="h-full">
          {recognizedText ? (
            <p 
              className="text-4xl font-semibold leading-relaxed tracking-wide break-words"
              data-testid="text-output"
            >
              {recognizedText}
            </p>
          ) : (
            <p className="text-xl text-muted-foreground">
              Start recognizing to see letters appear here...
            </p>
          )}
        </ScrollArea>
      </div>

      {recentLetters && recentLetters.length > 0 && (
        <div className="p-4 border-t border-card-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Letters</h3>
          <div className="flex flex-wrap gap-2">
            {recentLetters.map((letter, idx) => (
              <Badge 
                key={idx} 
                variant="secondary"
                className="text-lg font-mono w-10 h-10 flex items-center justify-center"
                data-testid={`badge-letter-${idx}`}
              >
                {letter}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
