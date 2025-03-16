/**
 * File: inovacademico/frontend/src/components/ResultDisplay.js
 * Component for displaying the bibliography correction results
 */
import { useState, useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { motion, AnimatePresence } from 'framer-motion';

const ResultDisplay = ({ correctionResult, onSaveToHistory, onRequestFeedback }) => {
  const [copied, setCopied] = useState(false);
  const [highlightedResult, setHighlightedResult] = useState('');
  const [activeTab, setActiveTab] = useState('comparison');
  
  useEffect(() => {
    if (correctionResult?.corrected) {
      // Simulação básica de destaque para bibliografia
      const highlighted = hljs.highlight(
        correctionResult.corrected,
        { language: 'markdown' }
      ).value;
      setHighlightedResult(highlighted);
    }
  }, [correctionResult]);

  const handleCopyToClipboard = () => {
    if (correctionResult?.corrected) {
      navigator.clipboard.writeText(correctionResult.corrected);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveToHistory = () => {
    if (correctionResult && onSaveToHistory) {
      onSaveToHistory(correctionResult);
    }
  };

  const handleRequestFeedback = () => {
    if (onRequestFeedback) {
      onRequestFeedback();
    }
  };

  if (!correctionResult || !correctionResult.corrected) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-1 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 rounded-xl shadow-lg overflow-hidden">
          <div className="p-5 bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-orange-300 inline-block text-transparent bg-clip-text">
                Bibliografia Corrigida
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-md transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
                <button
                  onClick={handleSaveToHistory}
                  className="flex items-center px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-md transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Salvar
                </button>
                <button
                  onClick={handleRequestFeedback}
                  className="flex items-center px-3 py-1 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white text-sm rounded-md transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Avaliar
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-4">
              <button
                onClick={() => setActiveTab('comparison')}
                className={`flex-1 py-2 font-medium text-center transition-colors ${
                  activeTab === 'comparison'
                    ? 'text-rose-400 border-b-2 border-rose-500'
                    : 'text-gray-400 hover:text-rose-300'
                }`}
              >
                Comparação
              </button>
              <button
                onClick={() => setActiveTab('original')}
                className={`flex-1 py-2 font-medium text-center transition-colors ${
                  activeTab === 'original'
                    ? 'text-rose-400 border-b-2 border-rose-500'
                    : 'text-gray-400 hover:text-rose-300'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setActiveTab('corrected')}
                className={`flex-1 py-2 font-medium text-center transition-colors ${
                  activeTab === 'corrected'
                    ? 'text-rose-400 border-b-2 border-rose-500'
                    : 'text-gray-400 hover:text-rose-300'
                }`}
              >
                Corrigida
              </button>
            </div>
            
            {/* Content based on active tab */}
            {activeTab === 'comparison' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/80 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                    <h3 className="text-gray-400 font-medium text-sm">Bibliografia Original</h3>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-md text-gray-300 border-l-2 border-gray-600 font-mono text-sm">
                    {correctionResult.original}
                  </div>
                </div>
                
                <div className="bg-gray-800/80 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div>
                    <h3 className="text-rose-300 font-medium text-sm">Bibliografia Corrigida</h3>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-md text-white border-l-2 border-rose-500 font-mono text-sm">
                    <pre dangerouslySetInnerHTML={{ __html: highlightedResult }} />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'original' && (
              <div className="bg-gray-800/80 p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                  <h3 className="text-gray-400 font-medium text-sm">Bibliografia Original</h3>
                </div>
                <div className="p-4 bg-gray-800 rounded-md text-gray-300 border-l-2 border-gray-600 font-mono text-sm whitespace-pre-wrap">
                  {correctionResult.original}
                </div>
              </div>
            )}
            
            {activeTab === 'corrected' && (
              <div className="bg-gray-800/80 p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div>
                  <h3 className="text-rose-300 font-medium text-sm">Bibliografia Corrigida</h3>
                </div>
                <div className="p-4 bg-gray-800 rounded-md overflow-auto shadow-inner">
                  <pre 
                    className="text-white whitespace-pre-wrap font-mono text-sm"
                    dangerouslySetInnerHTML={{ __html: highlightedResult }}
                  />
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div>
                <h3 className="text-rose-300 font-medium text-sm">Detalhes da correção</h3>
              </div>
              
              <div className="pl-4 space-y-3">
                {correctionResult.style && (
                  <div className="flex items-center">
                    <span className="text-gray-400 text-xs mr-2">Estilo aplicado:</span>
                    <span className="px-2 py-1 bg-gradient-to-r from-rose-600 to-orange-500 text-white text-xs rounded-full uppercase">
                      {correctionResult.style}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <span className="text-gray-400 text-xs mr-2">Data da correção:</span>
                  <span className="text-gray-300 text-xs">
                    {new Date().toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-center">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  <span>Verificação realizada utilizando inteligência artificial avançada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultDisplay;