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
  const [correctedBibliography, setCorrectedBibliography] = useState(null);
  const [originalBibliography, setOriginalBibliography] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [bibliographyInput, setBibliographyInput] = useState('');

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
    setCorrectedBibliography(result.corrected);
    
    // Save to history
    historyService.saveToHistory({
      original: result.original,
      corrected: result.corrected
    });
  };

  const handleHistoryItemSelect = (item) => {
    setBibliographyInput(item.original);
    setCorrectedBibliography(item.corrected);
    setOriginalBibliography(item.original);
  };

  const handleRequestFeedback = () => {
    setShowFeedback(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>InovAcadêmico - Correção de Bibliografias</title>
        <meta name="description" content="Ferramenta para correção de bibliografias acadêmicas usando IA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gradient-to-r from-rose-900 to-gray-900 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" className="h-20 w-20 mr-3">
              <defs>
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
                <linearGradient id="capGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e11d48" /> {/* vermelho */}
                  <stop offset="100%" stopColor="#f97316" /> {/* laranja */}
                </linearGradient>
                <linearGradient id="capTopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#be123c" /> {/* vermelho escuro */}
                  <stop offset="100%" stopColor="#ea580c" /> {/* laranja escuro */}
                </linearGradient>
              </defs>
              
              {/* Graduation Cap */}
              <g transform="translate(70, 40)" filter="url(#shadow)">
                {/* Cap top */}
                <path d="M0,50 L80,0 L160,50 L80,100 Z" fill="url(#capTopGradient)">
                  <animate attributeName="d" 
                          values="M0,50 L80,0 L160,50 L80,100 Z; 
                                M5,45 L80,-5 L155,45 L80,95 Z; 
                                M0,50 L80,0 L160,50 L80,100 Z" 
                          dur="3s" 
                          repeatCount="indefinite" 
                          calcMode="spline"
                          keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                </path>
                
                {/* Cap bottom part (cylinder) */}
                <path d="M40,70 L40,110 L120,110 L120,70 C120,85 40,85 40,70 Z" fill="#be123c">
                  <animate attributeName="d" 
                          values="M40,70 L40,110 L120,110 L120,70 C120,85 40,85 40,70 Z;
                                M40,70 L40,112 L120,112 L120,70 C120,87 40,87 40,70 Z;
                                M40,70 L40,110 L120,110 L120,70 C120,85 40,85 40,70 Z" 
                          dur="3s" 
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                </path>
                
                {/* Tassel */}
                <g>
                  {/* Tassel string */}
                  <path d="M30,70 C20,95 15,120 25,140" stroke="#FFD700" strokeWidth="3" fill="none">
                    <animate attributeName="d" 
                            values="M30,70 C20,95 15,120 25,140;
                                  M30,70 C25,100 20,120 30,140;
                                  M30,70 C20,95 15,120 25,140" 
                            dur="2s" 
                            repeatCount="indefinite"
                            calcMode="spline"
                            keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
                  </path>
                  
                  {/* Tassel end */}
                  <path d="M25,140 C25,145 25,150 35,155 C28,160 25,165 30,170 C35,165 40,160 45,165 C45,160 45,155 40,150 C35,145 25,145 25,140 Z" fill="#FFD700">
                    <animate attributeName="transform" 
                            attributeType="XML" 
                            type="rotate" 
                            from="0 25 140" 
                            to="360 25 140" 
                            dur="4s" 
                            repeatCount="indefinite"/>
                  </path>
                </g>
              </g>
              
              {/* Decorative elements */}
              <circle cx="50" cy="30" r="3" fill="#ec4899">
                <animate attributeName="cy" values="30;20;30" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="250" cy="50" r="4" fill="#FFD700">
                <animate attributeName="cy" values="50;40;50" dur="2.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="230" cy="150" r="3" fill="#f97316">
                <animate attributeName="cy" values="150;140;150" dur="3.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="70" cy="170" r="3" fill="#ec4899">
                <animate attributeName="cy" values="170;160;170" dur="2.7s" repeatCount="indefinite"/>
              </circle>
              <circle cx="90" cy="160" r="4" fill="#ec4899" opacity="0.8">
                <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
            <div>
              <h1 className="text-3xl font-bold text-white">InovAcadêmico</h1>
              <p className="text-rose-400 text-sm">Correção inteligente de bibliografias</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:block mr-6 w-64">
              <StatsCounter />
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-rose-300 text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Funcionalidade em breve!');
                    }}
                  >
                    Sobre
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-rose-300 text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Funcionalidade em breve!');
                    }}
                  >
                    Ajuda
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        <div className="md:hidden px-4 py-2 bg-gray-900">
          <StatsCounter />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Corrija suas referências bibliográficas</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Cole suas referências para corrigir conforme as normas acadêmicas (ABNT, APA, etc.)
            usando tecnologia de inteligência artificial.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-800 to-rose-900/30 rounded-lg shadow-lg p-6 mb-8">
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
          <div className="max-w-3xl mx-auto bg-red-900 text-white p-4 rounded mb-8">
            <h3 className="font-bold">Erro:</h3>
            <p>{error}</p>
          </div>
        )}

        {correctedBibliography && !isLoading && (
          <>
            <ResultDisplay 
              original={originalBibliography} 
              corrected={correctedBibliography}
              onRequestFeedback={handleRequestFeedback}
            />
          </>
        )}
      </main>

      <footer className="bg-gradient-to-r from-rose-900 to-gray-800 py-4 text-center text-gray-400 mt-12">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} InovAcadêmico - Tecnologia para pesquisa acadêmica</p>
          <div className="mt-2 text-xs">
            <a href="#" className="hover:text-rose-300 mx-2">Termos de Uso</a>
            <a href="#" className="hover:text-rose-300 mx-2">Política de Privacidade</a>
          </div>
        </div>
      </footer>

      {/* History drawer */}
      <HistoryDrawer onSelectItem={handleHistoryItemSelect} />

      {/* Feedback dialog */}
      {showFeedback && (
        <FeedbackDialog 
          correctedText={correctedBibliography}
          onClose={handleCloseFeedback}
        />
      )}
    </div>
  );
}