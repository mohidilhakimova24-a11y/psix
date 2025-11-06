import React from 'react';
import { MoodResult } from '../types';

interface ResultScreenProps {
  result: MoodResult;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onReset }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center animate-fade-in">
      <p className="text-lg text-gray-300 mb-2">Sizning hozirgi kayfiyatingiz:</p>
      <h1 
        className="text-7xl font-black mb-4 transition-colors duration-500" 
        style={{ 
          color: result.colorHex,
          textShadow: `0 0 15px ${result.colorHex}99`
        }}
      >
        {result.mood}
      </h1>
      
      <div 
        className="w-32 h-32 rounded-full mb-8 shadow-2xl transition-all duration-500"
        style={{ 
          backgroundColor: result.colorHex,
          boxShadow: `0 0 40px ${result.colorHex}, 0 0 20px ${result.colorHex}cc` 
        }}
      ></div>

      <p className="text-xl text-gray-200 mb-10 max-w-md italic">
        "{result.description}"
      </p>

      <button
        onClick={onReset}
        className="px-10 py-4 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300 transform hover:scale-110"
      >
        Qayta o'ynash
      </button>
    </div>
  );
};

export default ResultScreen;