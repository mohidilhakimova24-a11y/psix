import React from 'react';

const AnalysisScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full animate-fade-in py-16">
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
        <div className="absolute animate-spin-reverse rounded-full h-24 w-24 border-t-4 border-b-4 border-pink-500"></div>
      </div>
      <h2 className="text-3xl font-bold text-gray-100 mt-40">Javoblaringiz tahlil qilinmoqda...</h2>
      <p className="text-gray-300 mt-2">Kayfiyatingiz rangi aniqlanmoqda.</p>
    </div>
  );
};

// Custom animation for reverse spin
const style = document.createElement('style');
style.innerHTML = `
@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
.animate-spin-reverse {
  animation: spin-reverse 1s linear infinite;
}
`;
document.head.appendChild(style);


export default AnalysisScreen;