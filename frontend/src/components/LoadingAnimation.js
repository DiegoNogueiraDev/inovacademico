/**
 * File: inovacademico/frontend/src/components/LoadingAnimation.js
 * Animated loading component
 */
import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="py-8 flex flex-col items-center loading-animation">
      <div className="relative w-28 h-28 mx-auto">
        {/* Fundo sutil */}
        <div className="absolute inset-0 rounded-full bg-rose-500/10 blur-lg"></div>
        
        {/* Círculo central e bolinhas orbitando */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-24 h-24">
            {/* Ponto central */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-rose-600 rounded-full z-10"></div>
            
            {/* Bolinhas orbitando */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-3 h-3 rounded-full"
                style={{
                  animation: `orbit 3s linear infinite`,
                  animationDelay: `${i * 0.25}s`,
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 30}deg) translateX(40px) scale(${1 - (i % 3) * 0.15})`,
                  backgroundColor: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#e11d48' : '#ec4899',
                  opacity: 0.8,
                  boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Corrigindo Bibliografia</h3>
        <p className="text-gray-400 max-w-md">
          Aguarde um momento...
        </p>
      </div>
      
      <style jsx>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;