
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, MoodResult } from './types';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import AnalysisScreen from './components/AnalysisScreen';
import ResultScreen from './components/ResultScreen';
import ErrorScreen from './components/ErrorScreen';
import { analyzeMood } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [selections, setSelections] = useState<string[]>([]);
  const [result, setResult] = useState<MoodResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // Start at 50% volume

  useEffect(() => {
    const audioElement = document.getElementById('background-music') as HTMLAudioElement;
    if (audioElement) {
      audioRef.current = audioElement;
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleStartGame = () => {
    if (audioRef.current && !isMusicMuted) {
       audioRef.current.play().catch(e => console.error("Musiqani ijro etishda xatolik:", e));
    }
    setGameState('playing');
  };
  
  const handleReset = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    setGameState('start');
    setSelections([]);
    setResult(null);
    setError(null);
  };
  
  const toggleMute = () => {
      const currentlyMuted = !isMusicMuted;
      setIsMusicMuted(currentlyMuted);
      if (audioRef.current) {
          audioRef.current.muted = currentlyMuted;
      }
  };

  const handleGameComplete = useCallback((finalSelections: string[]) => {
    setSelections(finalSelections);
    setGameState('analyzing');
  }, []);

  useEffect(() => {
    if (gameState === 'analyzing' && selections.length > 0) {
      const getAnalysis = async () => {
        try {
          setError(null);
          const moodResult = await analyzeMood(selections);
          setResult(moodResult);
          setGameState('result');
        } catch (err) {
          console.error("Error analyzing mood:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
          setGameState('error');
        }
      };
      getAnalysis();
    }
  }, [gameState, selections]);

  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={handleStartGame} />;
      case 'playing':
        return <GameScreen onComplete={handleGameComplete} />;
      case 'analyzing':
        return <AnalysisScreen />;
      case 'result':
        return result && <ResultScreen result={result} onReset={handleReset} />;
      case 'error':
        return <ErrorScreen message={error || "Something went wrong."} onReset={handleReset} />;
      default:
        return <StartScreen onStart={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl glass-card">
        {renderContent()}
      </div>
       <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            aria-label={isMusicMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
          >
            {isMusicMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l-4-4m0 4l4-4" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            )}
          </button>
       </div>
    </div>
  );
};

export default App;