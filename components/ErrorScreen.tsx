import React from 'react';

interface ErrorScreenProps {
  message: string;
  onReset: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onReset }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in p-8 bg-red-900/30 border border-red-500/50 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-3xl font-bold text-red-300 mb-2">Voy! Xatolik yuz berdi.</h2>
      <p className="text-red-200 mb-6">{message}</p>
      <button
        onClick={onReset}
        className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
      >
        Qayta urinish
      </button>
    </div>
  );
};

export default ErrorScreen;