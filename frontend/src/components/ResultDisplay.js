/**
 * File: inovacademico/frontend/src/components/ResultDisplay.js
 * Component to display corrected bibliography
 */
import { useState } from 'react';

const ResultDisplay = ({ original, corrected, onRequestFeedback }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('corrected');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(corrected)
      .then(() => {
        setCopied(true);
        
        // Reset the copied state after 3 seconds
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('corrected')}
          className={`flex-1 py-3 font-medium text-center transition-colors ${
            activeTab === 'corrected'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Corrigida
        </button>
        <button
          onClick={() => setActiveTab('original')}
          className={`flex-1 py-3 font-medium text-center transition-colors ${
            activeTab === 'original'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Original
        </button>
        <button
          onClick={() => setActiveTab('diff')}
          className={`flex-1 py-3 font-medium text-center transition-colors ${
            activeTab === 'diff'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Alterações
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-purple-400">
            {activeTab === 'corrected' && 'Bibliografia Corrigida'}
            {activeTab === 'original' && 'Bibliografia Original'}
            {activeTab === 'diff' && 'Alterações Realizadas'}
          </h3>
          
          <div className="flex space-x-2">
            {activeTab === 'corrected' && (
              <>
                <button
                  onClick={onRequestFeedback}
                  className="text-sm px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center transition duration-200"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  Avaliar
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center transition duration-200"
                >
                  <span className="mr-1">
                    {copied ? 'Copiado!' : 'Copiar'}
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" 
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      
        {activeTab === 'corrected' && (
          <div className="bg-gray-700 p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-white font-mono text-sm">{corrected}</pre>
          </div>
        )}
        
        {activeTab === 'original' && (
          <div className="bg-gray-700 p-4 rounded-md opacity-75">
            <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">{original}</pre>
          </div>
        )}
        
        {activeTab === 'diff' && (
          <div className="bg-gray-700 p-4 rounded-md">
            <div className="text-sm text-gray-300 mb-4">
              <p>Comparação entre a bibliografia original e corrigida:</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-gray-300">Remoções</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-gray-300">Adições</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-600">
              <p className="text-gray-400 text-sm italic">
                Funcionalidade de visualização de alterações em desenvolvimento...
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <a
            href="#"
            className="text-sm text-gray-400 hover:text-white inline-flex items-center"
            onClick={(e) => {
              e.preventDefault();
              alert('Funcionalidade em desenvolvimento');
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Saiba mais sobre as normas
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;