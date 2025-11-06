import React, { useState, useEffect } from 'react';
import { GAME_ROUNDS } from '../constants';

interface GameScreenProps {
  onComplete: (selections: string[]) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onComplete }) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selections, setSelections] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(true);

  const currentRound = GAME_ROUNDS[currentRoundIndex];
  const progress = ((currentRoundIndex) / GAME_ROUNDS.length) * 100;

  useEffect(() => {
    setImageLoading(true);
    const img = new Image();
    img.src = currentRound.imageUrl;
    img.onload = () => setImageLoading(false);
  }, [currentRound.imageUrl]);

  const handleSelectWord = (word: string) => {
    const newSelections = [...selections, word];
    setSelections(newSelections);

    if (currentRoundIndex < GAME_ROUNDS.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
    } else {
      onComplete(newSelections);
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-2.5 mb-6">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="text-gray-300 mb-4">
        Rasm {currentRoundIndex + 1} / {GAME_ROUNDS.length}
      </p>

      {/* Image Container */}
      <div className="w-full aspect-w-4 aspect-h-3 rounded-xl overflow-hidden mb-6 bg-white/5 shadow-lg relative border border-white/10">
        {imageLoading ? (
           <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fuchsia-400"></div>
          </div>
        ) : (
          <img
            key={currentRound.imageUrl}
            src={currentRound.imageUrl}
            alt="Abstract art"
            className="object-cover w-full h-full animate-fade-in-slow"
          />
        )}
      </div>

      {/* Word Choices */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {currentRound.words.map((word) => (
          <button
            key={word}
            onClick={() => handleSelectWord(word)}
            disabled={imageLoading}
            className="p-4 bg-white/5 border border-white/10 rounded-lg text-center font-semibold text-lg hover:bg-white/20 hover:border-white/30 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;