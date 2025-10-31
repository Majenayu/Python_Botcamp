import StatusBar from '../StatusBar';

export default function StatusBarExample() {
  return (
    <StatusBar
      cameraActive={true}
      audioActive={true}
      fps={30}
      wordsRecognized={42}
      sessionDuration={185}
    />
  );
}
