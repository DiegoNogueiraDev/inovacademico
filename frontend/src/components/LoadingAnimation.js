/**
 * File: inovacademico/frontend/src/components/LoadingAnimation.js
 * Loading animation component
 */
const LoadingAnimation = () => {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="relative">
          <div className="h-24 w-24">
            <div className="absolute h-16 w-16 border-4 border-t-green-500 border-r-purple-500 border-b-pink-500 border-l-green-500 rounded-full animate-spin"></div>
            <div className="absolute h-16 w-16 border-4 border-transparent border-t-purple-300 rounded-full animate-ping"></div>
          </div>
          <div className="mt-4 text-center text-white">
            <p>Processando com IA</p>
            <p className="text-xs text-gray-400 mt-1">Isso pode levar alguns segundos...</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default LoadingAnimation;