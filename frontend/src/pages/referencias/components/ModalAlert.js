/**
 * Componente para exibir alertas modais estilizados no tema da aplicação
 * Substitui os alert() padrão do JavaScript
 */
import { useEffect } from 'react';

const ModalAlert = ({ 
  isOpen, 
  onClose, 
  message, 
  title = null, 
  type = 'info', // 'info', 'success', 'warning', 'error'
  confirmText = 'OK'
}) => {
  useEffect(() => {
    // Impedir o scroll do body quando o modal estiver aberto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Permitir fechar o modal com a tecla ESC
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  // Configurações visuais com base no tipo
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          iconBgColor: 'bg-rose-600/20',
          iconColor: 'text-rose-400',
          svg: (
            <img src="/check-animated.svg" alt="Sucesso" className="h-6 w-6" />
          ),
          defaultTitle: 'Sucesso!',
          buttonBg: 'bg-rose-600 hover:bg-rose-700'
        };
      case 'error':
        return {
          iconBgColor: 'bg-red-600/20',
          iconColor: 'text-red-400',
          svg: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          defaultTitle: 'Erro',
          buttonBg: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          iconBgColor: 'bg-yellow-600/20',
          iconColor: 'text-yellow-400',
          svg: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          defaultTitle: 'Atenção',
          buttonBg: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default: // info
        return {
          iconBgColor: 'bg-blue-600/20',
          iconColor: 'text-blue-400',
          svg: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          defaultTitle: 'Informação',
          buttonBg: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };
  
  const config = getTypeConfig();
  const displayTitle = title || config.defaultTitle;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-2xl border border-gray-700 max-w-md w-full p-6 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start mb-4">
          <div className={`${config.iconBgColor} ${config.iconColor} p-3 rounded-full mr-4`}>
            {config.svg}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{displayTitle}</h3>
            <p className="text-gray-300">{message}</p>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 ${config.buttonBg} text-white rounded-lg transition-colors duration-200`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlert; 