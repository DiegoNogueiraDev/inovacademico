/**
 * File: inovacademico/frontend/src/components/LoadingAnimation.js
 * Animated loading component
 */
import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="py-8 flex flex-col items-center">
      <div className="relative w-24 h-24">
        {/* Glowing background circles */}
        <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse"></div>
        
        {/* Orbiting dots around center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-16 h-16">
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-rose-600 rounded-full"></div>
            
            {/* Orbital dots */}
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-3 h-3 rounded-full"
                style={{
                  animation: `orbit 1.5s linear infinite`,
                  animationDelay: `${i * 0.15}s`,
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 45}deg) translateX(30px) rotate(-${i * 45}deg)`,
                  backgroundColor: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#e11d48' : '#ec4899',
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Spinning arc */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e11d48" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="url(#loadingGradient)" 
              strokeWidth="8" 
              strokeLinecap="round"
              strokeDasharray="80 200"
            />
          </svg>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Corrigindo Bibliografia</h3>
        <p className="text-gray-400 max-w-md">
          Nosso modelo de IA está verificando e corrigindo sua bibliografia conforme as normas acadêmicas...
        </p>
        
        <div className="flex justify-center mt-4 space-x-1">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" 
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(30px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(30px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;