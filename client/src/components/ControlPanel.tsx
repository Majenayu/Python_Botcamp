import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ControlPanelProps {
  isRecognizing: boolean;
  onToggleRecognition: () => void;
  autoSpeak: boolean;
  onAutoSpeakChange: (value: boolean) => void;
  volume: number;
  onVolumeChange: (value: number) => void;
  sensitivity: number;
  onSensitivityChange: (value: number) => void;
  language: string;
  onLanguageChange: (value: string) => void;
}

export default function ControlPanel({
  isRecognizing,
  onToggleRecognition,
  autoSpeak,
  onAutoSpeakChange,
  volume,
  onVolumeChange,
  sensitivity,
  onSensitivityChange,
  language,
  onLanguageChange
}: ControlPanelProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <Button
          size="lg"
          variant={isRecognizing ? 'destructive' : 'default'}
          className="w-full"
          onClick={onToggleRecognition}
          data-testid="button-toggle-recognition"
        >
          {isRecognizing ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Stop Recognition
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Recognition
            </>
          )}
        </Button>

        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
              data-testid="button-toggle-settings"
            >
              <Settings className="w-4 h-4 mr-2" />
              {settingsOpen ? 'Hide Settings' : 'Show Settings'}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-speak">Auto-Speak</Label>
                <Switch
                  id="auto-speak"
                  checked={autoSpeak}
                  onCheckedChange={onAutoSpeakChange}
                  data-testid="switch-auto-speak"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically speak recognized text
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="volume">Volume</Label>
                <span className="text-sm text-muted-foreground">
                  {volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </span>
              </div>
              <Slider
                id="volume"
                min={0}
                max={100}
                step={1}
                value={[volume]}
                onValueChange={(value) => onVolumeChange(value[0])}
                data-testid="slider-volume"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sensitivity">Detection Sensitivity</Label>
              <Slider
                id="sensitivity"
                min={0}
                max={100}
                step={1}
                value={[sensitivity]}
                onValueChange={(value) => onSensitivityChange(value[0])}
                data-testid="slider-sensitivity"
              />
              <p className="text-sm text-muted-foreground">
                Higher sensitivity detects more gestures
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Speech Language</Label>
              <Select value={language} onValueChange={onLanguageChange}>
                <SelectTrigger id="language" data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                  <SelectItem value="zh-CN">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
}
