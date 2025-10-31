import OutputPanel from '../OutputPanel';

export default function OutputPanelExample() {
  const mockWords = [
    { word: 'Hello', timestamp: Date.now() - 5000 },
    { word: 'World', timestamp: Date.now() - 3000 },
    { word: 'How', timestamp: Date.now() - 2000 },
    { word: 'Are', timestamp: Date.now() - 1000 },
    { word: 'You', timestamp: Date.now() }
  ];

  return (
    <OutputPanel
      recognizedText="Hello World How Are You"
      recentWords={mockWords}
      onClear={() => console.log('Clear clicked')}
      onSpeak={() => console.log('Speak clicked')}
      isSpeaking={false}
    />
  );
}
