import { useState, useEffect } from 'react';
import VideoFeed from '@/components/VideoFeed';
import OutputPanel from '@/components/OutputPanel';
import ControlPanel from '@/components/ControlPanel';
import StatusBar from '@/components/StatusBar';
import ASLReference from '@/components/ASLReference';
import HelpDialog from '@/components/HelpDialog';
import ThemeToggle from '@/components/ThemeToggle';
import { Hand, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [recentLetters, setRecentLetters] = useState<string[]>([]);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [volume, setVolume] = useState(80);
  const [sensitivity, setSensitivity] = useState(70);
  const [language, setLanguage] = useState('en-US');
  const [fps, setFps] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<string | undefined>(undefined);
  const [showReference, setShowReference] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecognizing) {
      setFps(30);
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    } else {
      setFps(0);
      setCurrentLetter(undefined);
    }
    return () => clearInterval(interval);
  }, [isRecognizing]);

  const handleLetterDetected = (letter: string) => {
    setCurrentLetter(letter);
    setRecognizedText(prev => prev + letter);
    setRecentLetters(prev => [...prev.slice(-9), letter]);
    
    if (autoSpeak && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = language;
      utterance.volume = volume / 100;
      utterance.rate = 1.5;
      window.speechSynthesis.speak(utterance);
    }
    
    console.log('Letter detected:', letter);
  };

  const handleClear = () => {
    setRecognizedText('');
    setRecentLetters([]);
    console.log('Clear clicked');
  };

  const handleBackspace = () => {
    setRecognizedText(prev => prev.slice(0, -1));
    setRecentLetters(prev => prev.slice(0, -1));
    console.log('Backspace clicked');
  };

  const handleSpeak = () => {
    if (recognizedText && 'speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(recognizedText);
      utterance.lang = language;
      utterance.volume = volume / 100;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      console.log('Speaking:', recognizedText);
    }
  };

  const handleToggleRecognition = () => {
    setIsRecognizing(!isRecognizing);
    if (!isRecognizing) {
      setSessionDuration(0);
    }
    console.log('Recognition toggled:', !isRecognizing);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
                <Hand className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SignSpeak</h1>
                <p className="text-sm text-muted-foreground">Real-time ASL letter recognition</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReference(!showReference)}
                data-testid="button-toggle-reference"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {showReference ? 'Hide' : 'Show'} Reference
              </Button>
              <HelpDialog />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="space-y-6">
          <StatusBar
            cameraActive={true}
            audioActive={autoSpeak}
            fps={fps}
            lettersRecognized={recentLetters.length}
            sessionDuration={sessionDuration}
            currentLetter={currentLetter}
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <VideoFeed 
                isRecognizing={isRecognizing}
                onLetterDetected={handleLetterDetected}
              />
              
              {showReference && (
                <ASLReference onClose={() => setShowReference(false)} />
              )}
              
              <div className="lg:hidden">
                <ControlPanel
                  isRecognizing={isRecognizing}
                  onToggleRecognition={handleToggleRecognition}
                  autoSpeak={autoSpeak}
                  onAutoSpeakChange={setAutoSpeak}
                  volume={volume}
                  onVolumeChange={setVolume}
                  sensitivity={sensitivity}
                  onSensitivityChange={setSensitivity}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="hidden lg:block">
                <ControlPanel
                  isRecognizing={isRecognizing}
                  onToggleRecognition={handleToggleRecognition}
                  autoSpeak={autoSpeak}
                  onAutoSpeakChange={setAutoSpeak}
                  volume={volume}
                  onVolumeChange={setVolume}
                  sensitivity={sensitivity}
                  onSensitivityChange={setSensitivity}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              </div>
              
              <div className="h-[500px]">
                <OutputPanel
                  recognizedText={recognizedText}
                  recentLetters={recentLetters}
                  onClear={handleClear}
                  onSpeak={handleSpeak}
                  onBackspace={handleBackspace}
                  isSpeaking={isSpeaking}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
