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

export default function Home() {
  const [correctionResult, setCorrectionResult] = useState(null);
  const [originalBibliography, setOriginalBibliography] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [bibliographyInput, setBibliographyInput] = useState('');
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      <Head>
        <title>InovAcadêmico - Correção de Bibliografias</title>
        <meta name="description" content="Ferramenta para correção de bibliografias acadêmicas usando IA" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </Head>

      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 right-10 w-20 h-20 bg-rose-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-orange-500 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-rose-600 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <header className="relative z-10 bg-gradient-to-r from-rose-900/80 to-gray-900/80 backdrop-blur-md shadow-lg border-b border-rose-900/30">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative w-24 h-24 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" className="w-full h-full">
                <defs>
                  <linearGradient id="capGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                  <linearGradient id="tasselGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffd700" />
                    <stop offset="100%" stopColor="#ffa500" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feFlood floodColor="#e11d48" floodOpacity="0.3" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Base Group */}
                <g transform="translate(140, 140)">
                  {/* Cap top (square platform) */}
                  <path 
                    d="M-60,-25 L0,-60 L60,-25 L0,10 Z" 
                    fill="url(#capGradient)" 
                    filter="url(#glow)"
                    className="drop-shadow-lg"
                  >
                    <animate 
                      attributeName="d" 
                      values="M-60,-25 L0,-60 L60,-25 L0,10 Z;
                             M-58,-28 L0,-63 L58,-28 L0,7 Z;
                             M-60,-25 L0,-60 L60,-25 L0,10 Z" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      calcMode="spline"
                      keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                  </path>
                  
                  {/* Cap bottom (cylinder) */}
                  <path 
                    d="M-40,0 L-40,30 L40,30 L40,0 C40,15 -40,15 -40,0 Z" 
                    fill="#be123c" 
                    filter="url(#glow)"
                  >
                    <animate 
                      attributeName="d" 
                      values="M-40,0 L-40,30 L40,30 L40,0 C40,15 -40,15 -40,0 Z;
                             M-38,2 L-38,32 L38,32 L38,2 C38,17 -38,17 -38,2 Z;
                             M-40,0 L-40,30 L40,30 L40,0 C40,15 -40,15 -40,0 Z" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      calcMode="spline"
                      keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                  </path>
                  
                  {/* Button on top */}
                  <circle cx="0" cy="-25" r="6" fill="#ffa500">
                    <animate 
                      attributeName="cy" 
                      values="-25;-28;-25" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      calcMode="spline"
                      keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                  </circle>
                  
                  {/* Tassel */}
                  <g>
                    {/* Tassel string */}
                    <path 
                      d="M0,-25 C-15,0 -25,25 -30,50" 
                      stroke="url(#tasselGradient)" 
                      strokeWidth="3" 
                      fill="none" 
                      strokeLinecap="round"
                    >
                      <animate 
                        attributeName="d" 
                        values="M0,-25 C-15,0 -25,25 -30,50;
                               M0,-25 C-10,0 -20,25 -25,50;
                               M0,-25 C-15,0 -25,25 -30,50" 
                        dur="4s" 
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                    </path>
                    
                    {/* Tassel end */}
                    <g transform="translate(-30, 50)">
                      <animateTransform 
                        attributeName="transform" 
                        type="translate" 
                        values="-30,50; -25,50; -30,50" 
                        dur="4s" 
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                        
                      <path 
                        d="M-5,0 C-5,5 -5,10 5,15 C-2,20 -5,25 0,30 C5,25 10,20 15,25 C15,20 15,15 10,10 C5,5 -5,5 -5,0 Z" 
                        fill="url(#tasselGradient)"
                      >
                        <animateTransform 
                          attributeName="transform" 
                          type="rotate" 
                          from="0 0 0" 
                          to="360 0 0" 
                          dur="10s" 
                          repeatCount="indefinite"/>
                      </path>
                    </g>
                  </g>
                </g>
                
                {/* Decorative floating particles */}
                <circle cx="50" cy="70" r="3" fill="#ec4899" opacity="0.8">
                  <animate attributeName="cy" values="70;60;70" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                  <animate attributeName="opacity" values="0.8;0.3;0.8" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                </circle>
                
                <circle cx="220" cy="100" r="4" fill="#f97316" opacity="0.8">
                  <animate attributeName="cy" values="100;85;100" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                  <animate attributeName="opacity" values="0.8;0.4;0.8" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                </circle>
                
                <circle cx="180" cy="210" r="3" fill="#ec4899" opacity="0.7">
                  <animate attributeName="cy" values="210;195;210" dur="4.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="4.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                </circle>
                
                <circle cx="90" cy="240" r="4" fill="#ffd700" opacity="0.6">
                  <animate attributeName="cy" values="240;225;240" dur="5.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="5.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                </circle>
              </svg>
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
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-rose-300 text-sm font-medium flex items-center transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Funcionalidade em breve!');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 16v-4M12 8h.01"></path>
                    </svg>
                    Sobre
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-rose-300 text-sm font-medium flex items-center transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Funcionalidade em breve!');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    Ajuda
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        <div className="md:hidden px-4 py-2 bg-gray-900/80 backdrop-blur-sm">
          <StatsCounter />
        </div>
      </header>

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
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-800 to-rose-900/20 rounded-xl shadow-2xl border border-rose-900/20 backdrop-blur-sm p-6 mb-12 transition-all duration-500 hover:shadow-rose-500/10">
          <BibliographyForm 
            onCorrectionResult={handleCorrectionResult} 
            setIsLoading={setIsLoading}
            setError={setError}
            initialValue={bibliographyInput}
            setInputValue={setBibliographyInput}
          />
        </div>

        {isLoading && (
          <div className="max-w-3xl mx-auto">
            <LoadingAnimation />
          </div>
        )}

        {error && (
          <div className="max-w-3xl mx-auto bg-red-900/80 backdrop-blur-sm text-white p-6 rounded-xl border border-red-700 mb-8 shadow-lg">
            <h3 className="font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Erro:
            </h3>
            <p className="mt-2">{error}</p>
          </div>
        )}

        {correctionResult && !isLoading && (
          <ResultDisplay 
            correctionResult={correctionResult}
            onRequestFeedback={handleRequestFeedback}
            onSaveToHistory={() => {
              // Já está sendo salvo automaticamente, mas poderia ser usado para salvar novamente
              alert('Bibliografia salva no histórico!');
            }}
          />
        )}
      </main>

      <footer className="bg-gradient-to-r from-rose-900/80 to-gray-900/80 backdrop-blur-md py-6 text-center text-gray-400 mt-12 border-t border-rose-900/30 relative z-10">
        <div className="container mx-auto px-4">
          <p className="font-medium">© {new Date().getFullYear()} InovAcadêmico - Tecnologia para pesquisa acadêmica</p>
          <div className="mt-3 text-sm flex justify-center space-x-6">
            <a href="#" className="hover:text-rose-300 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-rose-300 transition-colors">Política de Privacidade</a>
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
          onSubmit={(feedback) => {
            console.log('Feedback enviado:', feedback);
            return Promise.resolve();
          }}
        />
      )}
    </div>
  );
}