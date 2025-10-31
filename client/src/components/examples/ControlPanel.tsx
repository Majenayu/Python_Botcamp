import { useState } from 'react';
import ControlPanel from '../ControlPanel';

export default function ControlPanelExample() {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [volume, setVolume] = useState(80);
  const [sensitivity, setSensitivity] = useState(70);
  const [language, setLanguage] = useState('en-US');

  return (
    <ControlPanel
      isRecognizing={isRecognizing}
      onToggleRecognition={() => setIsRecognizing(!isRecognizing)}
      autoSpeak={autoSpeak}
      onAutoSpeakChange={setAutoSpeak}
      volume={volume}
      onVolumeChange={setVolume}
      sensitivity={sensitivity}
      onSensitivityChange={setSensitivity}
      language={language}
      onLanguageChange={setLanguage}
    />
  );
}
