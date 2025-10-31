import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Hand, Camera, Volume2, Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" data-testid="button-help">
          <HelpCircle className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>How to Use SignSpeak</DialogTitle>
          <DialogDescription>
            Learn how to get the best results from sign language recognition
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Camera Setup</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground ml-7">
                <li>• Ensure good lighting for best detection</li>
                <li>• Position yourself 1-2 feet from camera</li>
                <li>• Keep hands visible in the frame</li>
                <li>• Avoid busy backgrounds</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hand className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Hand Positioning</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground ml-7">
                <li>• Form gestures clearly and deliberately</li>
                <li>• Hold each sign for 1-2 seconds</li>
                <li>• Avoid rapid movements between signs</li>
                <li>• Keep fingers spread and visible</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Settings</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground ml-7">
                <li>• Adjust sensitivity if detection is too sensitive/insensitive</li>
                <li>• Enable auto-speak to hear text as it's recognized</li>
                <li>• Choose your preferred speech language</li>
                <li>• Control volume for speech output</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Speech Output</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground ml-7">
                <li>• Use the Speak button to hear recognized text</li>
                <li>• Auto-speak will read text automatically</li>
                <li>• Adjust volume in settings panel</li>
                <li>• Multiple languages supported</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Troubleshooting</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>No detection?</strong> Check camera permissions and lighting</li>
                <li>• <strong>Inaccurate results?</strong> Adjust sensitivity and slow down gestures</li>
                <li>• <strong>No speech?</strong> Check volume settings and browser permissions</li>
                <li>• <strong>Low FPS?</strong> Close other apps using camera/CPU</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
