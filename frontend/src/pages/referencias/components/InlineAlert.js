/**
 * Componente para exibir alerta inline dentro do conteúdo da página
 */
const InlineAlert = ({ message, type = 'success' }) => {
  if (!message) return null;
  
  const isSuccess = type === 'success';
  
  return (
    <div className={`mb-6 p-3 sm:p-4 rounded-lg border-l-4 transform transition-all duration-300 ${
      isSuccess 
        ? 'bg-gradient-to-r from-rose-900/50 to-rose-800/30 border-rose-500 text-rose-100' 
        : 'bg-gradient-to-r from-red-900/50 to-red-800/30 border-red-500 text-red-100'
    }`}>
      <div className="flex items-center">
        {isSuccess ? (
          <div className="h-8 w-8 rounded-full bg-rose-500/20 flex items-center justify-center mr-3 flex-shrink-0">
            <img src="/check-animated.svg" alt="Sucesso" className="h-6 w-6" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                <animate 
                  attributeName="stroke-dasharray" 
                  values="1, 150; 90, 150; 90, 150" 
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
        )}
        <div>
          <h4 className="font-medium">{isSuccess ? "Sucesso!" : "Erro"}</h4>
          <p className="text-sm opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default InlineAlert; 