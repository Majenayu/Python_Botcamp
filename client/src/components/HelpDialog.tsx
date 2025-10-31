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
            Learn how to get the best results from ASL letter recognition
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
                <li>• Use a plain background for better accuracy</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hand className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Forming Letters</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground ml-7">
                <li>• Reference the ASL alphabet chart shown below the video</li>
                <li>• Form each letter clearly and hold for 1-2 seconds</li>
                <li>• Keep your hand steady while signing</li>
                <li>• Make sure all fingers are visible and positioned correctly</li>
                <li>• Practice letters slowly before increasing speed</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Settings</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground ml-7">
                <li>• Adjust sensitivity if letters are detected too quickly/slowly</li>
                <li>• Enable auto-speak to hear each letter as it's recognized</li>
                <li>• Choose your preferred speech language</li>
                <li>• Control volume for speech output</li>
                <li>• Use backspace to correct mistakes</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Speech Output</h3>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground ml-7">
                <li>• Auto-speak will pronounce each letter as detected</li>
                <li>• Use the Speak button to hear the full text</li>
                <li>• Adjust volume in settings panel</li>
                <li>• Multiple languages supported</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Building Words & Sentences</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Sign each letter one at a time</li>
                <li>• Letters will appear in order to form words</li>
                <li>• Use the backspace button to delete the last letter</li>
                <li>• Use the clear button to start over</li>
                <li>• Recent letters are shown at the bottom for reference</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Troubleshooting</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>No detection?</strong> Check camera permissions and lighting</li>
                <li>• <strong>Wrong letters?</strong> Form signs more clearly and hold steady</li>
                <li>• <strong>Too fast?</strong> Reduce sensitivity in settings</li>
                <li>• <strong>Too slow?</strong> Increase sensitivity in settings</li>
                <li>• <strong>No speech?</strong> Check volume settings and browser permissions</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
