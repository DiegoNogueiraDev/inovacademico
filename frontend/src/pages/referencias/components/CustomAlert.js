/**
 * Componente para exibir alertas personalizados com animação
 */
const CustomAlert = ({ message, type = 'success', onClose }) => {
  if (!message) return null;
  
  const isSuccess = type === 'success';
  const baseClasses = "fixed top-6 right-6 z-50 shadow-xl rounded-lg p-4 flex items-center transform transition-all duration-500";
  const colorClasses = isSuccess 
    ? "bg-gradient-to-r from-rose-600/90 to-rose-800/90 border-l-4 border-rose-400 text-white"
    : "bg-gradient-to-r from-red-600/90 to-red-800/90 border-l-4 border-red-400 text-white";
  
  const iconSuccess = (
    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0">
      <img src="/check-animated.svg" alt="Sucesso" className="h-6 w-6" />
    </div>
  );
  
  const iconError = (
    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
          <animate 
            attributeName="stroke-dasharray" 
            values="1, 150; 90, 150; 90, 150" 
            dur="1.5s" 
            repeatCount="1" 
          />
          <animate 
            attributeName="stroke-dashoffset" 
            values="0; -35; -35" 
            dur="1.5s" 
            repeatCount="1" 
          />
        </path>
        <animateTransform 
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.5s"
          repeatCount="1"
        />
      </svg>
    </div>
  );
  
  return (
    <div className={`${baseClasses} ${colorClasses} opacity-100`}>
      {isSuccess ? iconSuccess : iconError}
      <div>
        <h4 className="font-medium text-white">{isSuccess ? "Sucesso!" : "Erro"}</h4>
        <p className="text-sm text-gray-100">{message}</p>
      </div>
      <button 
        className="ml-auto bg-white/10 rounded-full p-1 hover:bg-white/20 transition-colors"
        onClick={onClose}
      >
        <img src="/close-animated.svg" alt="Fechar" className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CustomAlert; 