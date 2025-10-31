import { useState, useEffect } from 'react';
import VideoFeed from '@/components/VideoFeed';
import OutputPanel from '@/components/OutputPanel';
import ControlPanel from '@/components/ControlPanel';
import StatusBar from '@/components/StatusBar';
import HelpDialog from '@/components/HelpDialog';
import ThemeToggle from '@/components/ThemeToggle';
import { Hand } from 'lucide-react';

export default function Home() {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [recentWords, setRecentWords] = useState<Array<{ word: string; timestamp: number }>>([]);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [volume, setVolume] = useState(80);
  const [sensitivity, setSensitivity] = useState(70);
  const [language, setLanguage] = useState('en-US');
  const [fps, setFps] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mockWords = ['Hello', 'World', 'How', 'Are', 'You', 'Today', 'Nice', 'Meet', 'Thank', 'Please'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecognizing) {
      setFps(30);
      interval = setInterval(() => {
        const randomWord = mockWords[Math.floor(Math.random() * mockWords.length)];
        setRecognizedText(prev => prev ? `${prev} ${randomWord}` : randomWord);
        setRecentWords(prev => [...prev.slice(-4), { word: randomWord, timestamp: Date.now() }]);
      }, 2000);
    } else {
      setFps(0);
    }
    return () => clearInterval(interval);
  }, [isRecognizing]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecognizing) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecognizing]);

  const handleClear = () => {
    setRecognizedText('');
    setRecentWords([]);
    console.log('Clear clicked');
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
                <p className="text-sm text-muted-foreground">Real-time sign language recognition</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
            wordsRecognized={recentWords.length}
            sessionDuration={sessionDuration}
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <VideoFeed 
                isRecognizing={isRecognizing}
                onHandDetected={(landmarks) => console.log('Hand detected:', landmarks)}
              />
              
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
                  recentWords={recentWords}
                  onClear={handleClear}
                  onSpeak={handleSpeak}
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
