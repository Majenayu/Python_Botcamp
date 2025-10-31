import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Volume2 } from 'lucide-react';

interface OutputPanelProps {
  recognizedText: string;
  recentWords: Array<{ word: string; timestamp: number }>;
  onClear: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
}

export default function OutputPanel({ 
  recognizedText, 
  recentWords, 
  onClear, 
  onSpeak,
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
              className="text-4xl font-semibold leading-relaxed"
              data-testid="text-output"
            >
              {recognizedText}
            </p>
          ) : (
            <p className="text-xl text-muted-foreground">
              Start recognizing to see text appear here...
            </p>
          )}
        </ScrollArea>
      </div>

      {recentWords.length > 0 && (
        <div className="p-4 border-t border-card-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Words</h3>
          <div className="flex flex-wrap gap-2">
            {recentWords.map((item, idx) => (
              <Badge 
                key={idx} 
                variant="secondary"
                className="text-sm"
                data-testid={`badge-word-${idx}`}
              >
                {item.word}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
