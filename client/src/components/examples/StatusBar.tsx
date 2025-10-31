import StatusBar from '../StatusBar';

export default function StatusBarExample() {
  return (
    <StatusBar
      cameraActive={true}
      audioActive={true}
      fps={30}
      lettersRecognized={42}
      sessionDuration={185}
      currentLetter="A"
    />
  );
}
