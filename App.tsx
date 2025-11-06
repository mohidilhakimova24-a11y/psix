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
  
  // --- Music Controls State ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default volume 50%

  // --- Effect to initialize and sync audio element ---
  useEffect(() => {
    // Initialize audioRef
    if (!audioRef.current) {
      audioRef.current = document.getElementById('background-music') as HTMLAudioElement;
    }

    if (audioRef.current) {
      // Sync volume
      audioRef.current.volume = volume;
      
      // Sync play/pause state
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Musiqani ijro etishda xatolik:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  const handleStartGame = () => {
    setIsPlaying(true); // Auto-play music on game start
    setGameState('playing');
  };
  
  const handleReset = () => {
    setIsPlaying(false); // Stop music on reset
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
    }
    setGameState('start');
    setSelections([]);
    setResult(null);
    setError(null);
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

  // --- Music Control Handlers ---
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

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
      {/* --- Music Controls UI --- */}
       <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 p-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-full text-white hover:bg-white/20 transition-all duration-300"
            aria-label={isPlaying ? "Musiqani to'xtatish" : "Musiqani ijro etish"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
            )}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange}
            className="w-24"
            aria-label="Ovoz balandligi"
          />
       </div>
    </div>
  );
};

export default App;