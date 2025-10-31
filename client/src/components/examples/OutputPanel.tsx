import OutputPanel from '../OutputPanel';

export default function OutputPanelExample() {
  const mockLetters = ['H', 'E', 'L', 'L', 'O'];

  return (
    <OutputPanel
      recognizedText="HELLO"
      recentLetters={mockLetters}
      onClear={() => console.log('Clear clicked')}
      onSpeak={() => console.log('Speak clicked')}
      onBackspace={() => console.log('Backspace clicked')}
      isSpeaking={false}
    />
  );
}
