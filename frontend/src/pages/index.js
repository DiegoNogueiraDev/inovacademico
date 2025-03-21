/**
 * File: inovacademico/frontend/src/pages/index.js
 * Home page
 */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import BibliographyForm from '../components/BibliographyForm';
import ResultDisplay from '../components/ResultDisplay';
import LoadingAnimation from '../components/LoadingAnimation';
import HistoryDrawer from '../components/HistoryDrawer';
import FeedbackDialog from '../components/FeedbackDialog';
import StatsCounter from '../components/StatsCounter';
import historyService from '../services/historyService';
import apiService from '../services/apiService';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  const [correctionResult, setCorrectionResult] = useState(null);
  const [originalBibliography, setOriginalBibliography] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [bibliographyInput, setBibliographyInput] = useState('');
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  
  // Referência para o componente de resultado
  const resultRef = React.useRef(null);

  useEffect(() => {
    // Check if the app is running in the browser
    if (typeof window !== 'undefined') {
      // Check if there's a tutorial flag in localStorage
      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
      if (!hasSeenTutorial) {
        // Show tutorial tooltip or banner here
        localStorage.setItem('hasSeenTutorial', 'true');
      }
    }
  }, []);

  // Efeito para mostrar e esconder alertas automaticamente
  useEffect(() => {
    if (message.text || error) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);
  
  // Efeito para fazer scroll até o resultado quando ele for carregado
  useEffect(() => {
    if (correctionResult && !isLoading && resultRef.current) {
      scrollToResult();
    }
  }, [correctionResult, isLoading]);

  const handleCorrectionResult = (result) => {
    if (result.original) {
      setOriginalBibliography(result.original);
    }
    
    // Criar objeto de resultado completo
    const fullResult = {
      original: result.original || originalBibliography,
      corrected: result.corrected,
      style: result.style || 'abnt',
      timestamp: new Date().toISOString()
    };
    
    setCorrectionResult(fullResult);
    
    // Save to history
    historyService.saveToHistory(fullResult);
    
    // Mostrar mensagem de sucesso
    setMessage({
      type: 'success',
      text: 'Bibliografia corrigida com sucesso!'
    });
    setError(null);
  };
  
  // Função para fazer scroll suave até o resultado
  const scrollToResult = () => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };

  const handleHistoryItemSelect = (item) => {
    setBibliographyInput(item.original);
    setCorrectionResult(item);
    setOriginalBibliography(item.original);
  };

  const handleRequestFeedback = () => {
    setShowFeedback(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  const handleToggleHistoryDrawer = () => {
    setShowHistoryDrawer(!showHistoryDrawer);
  };

  const handleClearHistory = () => {
    historyService.clearHistory();
    setMessage({
      type: 'success',
      text: 'Histórico limpo com sucesso!'
    });
  };

  // Função para renderizar alerta estilizado
  const renderAlert = () => {
    if ((!message.text && !error) || !showAlert) return null;
    
    const isSuccess = message.type === 'success';
    const alertText = error || message.text;
    const baseClasses = "fixed top-6 right-6 z-50 shadow-xl rounded-lg p-4 flex items-center transform transition-all duration-500";
    const colorClasses = isSuccess 
      ? "bg-gradient-to-r from-rose-600/90 to-rose-800/90 border-l-4 border-rose-400 text-white"
      : "bg-gradient-to-r from-red-600/90 to-red-800/90 border-l-4 border-red-400 text-white";
    const translateClass = showAlert ? "translate-x-0 opacity-100" : "translate-x-full opacity-0";
    
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
      <div className={`${baseClasses} ${colorClasses} ${translateClass}`}>
        {isSuccess ? iconSuccess : iconError}
        <div>
          <h4 className="font-medium text-white">{isSuccess ? "Sucesso!" : "Erro"}</h4>
          <p className="text-sm text-gray-100">{alertText}</p>
        </div>
        <button 
          className="ml-auto bg-white/10 rounded-full p-1 hover:bg-white/20 transition-colors"
          onClick={() => setShowAlert(false)}
        >
          <img src="/close-animated.svg" alt="Fechar" className="h-5 w-5" />
        </button>
      </div>
    );
  };

  // Novo componente Modal de Carregamento
  const LoadingModal = () => {
    if (!isLoading) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-8 rounded-xl shadow-2xl border border-rose-900/30 max-w-2xl w-full mx-4">
          <LoadingAnimation />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 relative">
      <Head>
        <title>InovAcadêmico - Correção de Bibliografias</title>
        <meta name="description" content="Ferramenta para correção de bibliografias acadêmicas usando IA" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </Head>

      {/* Modal de Carregamento */}
      <LoadingModal />

      {/* Alerta flutuante personalizado */}
      {renderAlert()}

      {/* Camada de animação de fundo com fixed para cobrir toda a página */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 right-10 w-28 h-28 bg-rose-500 rounded-full filter blur-3xl opacity-8 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-orange-500 rounded-full filter blur-3xl opacity-8 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-36 h-36 bg-rose-600 rounded-full filter blur-3xl opacity-8 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-rose-700 rounded-full filter blur-3xl opacity-8 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-32 h-32 bg-orange-600 rounded-full filter blur-3xl opacity-8 animate-pulse" style={{animationDelay: '2.5s'}}></div>
        
        {/* Adiciona elementos animados que vão até o footer */}
        <div className="absolute bottom-0 left-1/2 w-60 h-60 bg-rose-600/30 rounded-full filter blur-3xl opacity-8 animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-0 right-1/4 w-44 h-44 bg-orange-500/30 rounded-full filter blur-3xl opacity-8 animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <header className="relative z-10 bg-gradient-to-r from-rose-900/80 to-gray-900/80 backdrop-blur-md shadow-lg border-b border-rose-900/30">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative w-24 h-24 mr-4">
              <img src="/graduation-cap-theme.svg" alt="InovAcadêmico Logo" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">InovAcadêmico</h1>
              <div className="relative">
                <p className="text-rose-400 text-sm font-medium mt-1">Correção inteligente de bibliografias</p>
                <div className="absolute h-0.5 w-full bg-gradient-to-r from-rose-500 to-transparent mt-1"></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:block mr-6">
              <StatsCounter />
            </div>
            <nav>
              <ul className="flex space-x-5">
                <li>
                  <button 
                    onClick={handleToggleHistoryDrawer}
                    className="text-gray-300 hover:text-rose-300 text-sm font-medium flex items-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Histórico
                  </button>
                </li>
                <li>
                  <Link
                    href="/sobre" 
                    className="text-gray-300 hover:text-rose-300 text-sm font-medium flex items-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 16v-4M12 8h.01"></path>
                    </svg>
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/ajuda" 
                    className="text-gray-300 hover:text-rose-300 text-sm font-medium flex items-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    Ajuda
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        <div className="md:hidden px-4 py-2 bg-gray-900/80 backdrop-blur-sm">
          <StatsCounter />
        </div>
      </header>

      {/* Banner promocional */}
      <div className="relative z-10 bg-gradient-to-r from-rose-600/90 via-orange-500/90 to-rose-600/90 shadow-lg text-white py-3 animate-pulse">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-3">
            <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-bounce">
              NOVO
            </span>
            <h3 className="text-lg md:text-xl font-bold tracking-wider">
              TUDO DE GRAÇA POR TEMPO LIMITADO
            </h3>
            <div className="hidden md:block h-4 w-0.5 bg-white/40 rounded-full mx-2"></div>
            <p className="text-sm md:text-base">
              Aproveite todas as funcionalidades sem custo durante o período promocional!
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3 relative inline-block">
            Corrija suas referências bibliográficas
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-orange-500 to-transparent rounded-full"></div>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Cole suas referências para corrigir conforme as normas acadêmicas (ABNT, APA, etc.)
            usando <span className="text-rose-400 font-medium">tecnologia de inteligência artificial</span>.
          </p>
          <div className="mt-4">
            <Link href="/referencias" className="text-rose-400 hover:text-rose-300 inline-flex items-center transition-colors">
              <span>Acesse nosso Gerenciador de Referências</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-800 to-rose-900/20 rounded-xl shadow-2xl border border-rose-900/20 backdrop-blur-sm p-6 mb-12 transition-all duration-500 hover:shadow-rose-500/10">
          <BibliographyForm 
            onCorrectionResult={handleCorrectionResult} 
            setIsLoading={setIsLoading}
            setError={(errorMsg) => {
              setError(errorMsg);
              setMessage({ type: 'error', text: '' });
            }}
            initialValue={bibliographyInput}
            setInputValue={setBibliographyInput}
          />
        </div>

        {/* Bloco de erro */}
        {error && !showAlert && (
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-red-900/50 to-red-800/30 backdrop-blur-sm text-white p-4 rounded-xl border border-red-700 mb-8 shadow-lg">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Erro</h4>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          </div>
        )}

        {correctionResult && !isLoading && (
          <div ref={resultRef} className="max-w-3xl mx-auto">
            <ResultDisplay 
              correctionResult={correctionResult}
              onRequestFeedback={handleRequestFeedback}
              onSaveToHistory={() => {
                // Já está sendo salvo automaticamente, mas poderia ser usado para salvar novamente
                setMessage({
                  type: 'success',
                  text: 'Bibliografia salva no histórico!'
                });
              }}
            />
          </div>
        )}
        
        {/* Nova seção de destaque para o gerenciador de referências */}
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-800 to-rose-900/20 rounded-xl shadow-lg border border-gray-700 p-6 mt-12">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-rose-500/20 p-4 rounded-full flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-grow text-center md:text-left">
              <h3 className="text-xl font-semibold text-white mb-2">Gerenciador de Referências Bibliográficas</h3>
              <p className="text-gray-300 mb-3">
                Além da correção, organize todas as suas referências em um só lugar. Adicione, edite, formate e exporte suas referências bibliográficas.
              </p>
              <Link 
                href="/referencias" 
                className="inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Acessar Gerenciador
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-rose-900/70 to-gray-900/70 backdrop-blur-md py-6 text-center text-gray-400 mt-12 border-t border-rose-900/30 relative z-10">
        <div className="container mx-auto px-4">
          <p className="font-medium">© {new Date().getFullYear()} InovAcadêmico - Tecnologia para pesquisa acadêmica</p>
          
          {/* GitHub e Open Source Banner */}
          <div className="mt-4 mb-4 py-3 px-4 bg-gray-800/40 backdrop-blur-sm rounded-lg inline-flex items-center justify-center space-x-3 border border-rose-800/30 hover:bg-gray-800/60 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <p className="text-rose-300">Nosso projeto é OpenSource e você (Desenvolvedor) pode contribuir</p>
            <a 
              href="https://github.com/DiegoNogueiraDev/inovacademico" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-rose-600 hover:bg-rose-700 px-3 py-1 rounded-md text-white text-sm font-medium transition-colors"
            >
              Acessar GitHub
            </a>
          </div>
          
          <div className="mt-3 text-sm flex justify-center space-x-6">
            <Link href="/termos-de-uso" className="hover:text-rose-300 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/politica-de-privacidade" className="hover:text-rose-300 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/sobre" className="hover:text-rose-300 transition-colors">
              Sobre
            </Link>
            <Link href="/ajuda" className="hover:text-rose-300 transition-colors">
              Ajuda
            </Link>
            <a 
              href="https://github.com/DiegoNogueiraDev/inovacademico" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-rose-300 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* History drawer */}
      {showHistoryDrawer && (
        <HistoryDrawer 
          isOpen={showHistoryDrawer}
          onClose={() => setShowHistoryDrawer(false)}
          history={historyService.getHistory()}
          onSelectItem={handleHistoryItemSelect}
          onClearHistory={handleClearHistory}
        />
      )}

      {/* Feedback dialog */}
      {showFeedback && (
        <FeedbackDialog 
          isOpen={showFeedback}
          onClose={handleCloseFeedback}
          onSubmit={async (feedback) => {
            console.log('Feedback enviado:', feedback);
            
            // Adicionar os dados da bibliografia ao feedback
            const feedbackData = {
              ...feedback,
              original: correctionResult?.original || '',
              corrected: correctionResult?.corrected || ''
            };
            
            // Enviar para a API
            try {
              const result = await apiService.submitFeedback(feedbackData);
              setMessage({
                type: 'success',
                text: 'Feedback enviado com sucesso! Obrigado pela sua contribuição.'
              });
              return result;
            } catch (error) {
              console.error('Erro ao enviar feedback:', error);
              setMessage({
                type: 'error',
                text: 'Ocorreu um erro ao enviar o feedback. Tente novamente.'
              });
              throw error;
            }
          }}
        />
      )}
    </div>
  );
}