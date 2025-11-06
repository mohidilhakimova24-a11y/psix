import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400">
        Hissiy Palitra
      </h1>
      <p className="text-lg text-gray-200 mb-10 max-w-md">
        Hozirgi kayfiyatingiz rangini kashf eting. Sizga bir qator mavhum tasvirlar ko'rsatiladi. Har biri uchun sizga eng ma'qul kelgan so'zni tanlang.
      </p>
      <button
        onClick={onStart}
        className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full hover:shadow-lg hover:shadow-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-110"
      >
        Boshlash
      </button>
    </div>
  );
};

export default StartScreen;