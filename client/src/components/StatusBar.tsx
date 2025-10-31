import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, Activity } from 'lucide-react';

interface StatusBarProps {
  cameraActive: boolean;
  audioActive: boolean;
  fps: number;
  wordsRecognized: number;
  sessionDuration: number;
}

export default function StatusBar({ 
  cameraActive, 
  audioActive, 
  fps, 
  wordsRecognized,
  sessionDuration 
}: StatusBarProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="flex items-center gap-2">
          <Camera className={`w-4 h-4 ${cameraActive ? 'text-green-500' : 'text-muted-foreground'}`} />
          <div>
            <div className="text-xs text-muted-foreground">Camera</div>
            <Badge variant={cameraActive ? 'default' : 'secondary'} className="text-xs">
              {cameraActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Mic className={`w-4 h-4 ${audioActive ? 'text-green-500' : 'text-muted-foreground'}`} />
          <div>
            <div className="text-xs text-muted-foreground">Audio</div>
            <Badge variant={audioActive ? 'default' : 'secondary'} className="text-xs">
              {audioActive ? 'On' : 'Off'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">FPS</div>
            <div className="text-sm font-mono font-medium" data-testid="text-fps">{fps}</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground">Words</div>
          <div className="text-sm font-medium" data-testid="text-words-count">{wordsRecognized}</div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground">Duration</div>
          <div className="text-sm font-mono font-medium" data-testid="text-duration">
            {formatDuration(sessionDuration)}
          </div>
        </div>
      </div>
    </Card>
  );
}
