/**
 * File: inovacademico/frontend/src/components/BibliographyForm.js
 * Form component for bibliography input
 */
import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const BibliographyForm = ({ 
  onCorrectionResult, 
  setIsLoading, 
  setError, 
  initialValue = '',
  setInputValue
}) => {
  const [bibliography, setBibliography] = useState(initialValue);
  const [styles, setStyles] = useState([
    { id: 'abnt', name: 'ABNT', selected: true, description: 'Associação Brasileira de Normas Técnicas' },
    { id: 'apa', name: 'APA', selected: false, description: 'American Psychological Association' },
    { id: 'vancouver', name: 'Vancouver', selected: false, description: 'Utilizado em publicações médicas' },
    { id: 'mla', name: 'MLA', selected: false, description: 'Modern Language Association' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (initialValue) {
      setBibliography(initialValue);
      setCharCount(initialValue.length);
    }
  }, [initialValue]);

  const handleStyleSelect = (styleId) => {
    const updatedStyles = styles.map(style => ({
      ...style,
      selected: style.id === styleId
    }));
    setStyles(updatedStyles);
  };

  const getSelectedStyle = () => {
    const selected = styles.find(style => style.selected);
    return selected ? selected.id : 'abnt';
  };

  const getSelectedStyleInfo = () => {
    return styles.find(style => style.selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bibliography.trim()) {
      setError('Por favor, insira uma bibliografia para corrigir.');
      return;
    }
    
    setIsLoading(true);
    setIsSubmitting(true);
    setError(null);
    
    // Mostrar animação de carregamento e rolar para ela
    const loadingElement = document.querySelector('.loading-animation');
    if (loadingElement) {
      loadingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    try {
      const result = await apiService.correctBibliography(bibliography, getSelectedStyle());
      onCorrectionResult(result);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao corrigir a bibliografia. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleBibliographyChange = (e) => {
    const value = e.target.value;
    setBibliography(value);
    setCharCount(value.length);
    if (setInputValue) {
      setInputValue(value);
    }
  };

  const clearBibliography = () => {
    setBibliography('');
    setCharCount(0);
    if (setInputValue) {
      setInputValue('');
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setBibliography(text);
      setCharCount(text.length);
      if (setInputValue) {
        setInputValue(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="mb-6">
        <label 
          htmlFor="style" 
          className="flex items-center text-rose-400 text-lg font-medium mb-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 6V4M12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10M12 6C13.1046 6 14 6.89543 14 8C14 9.10457 13.1046 10 12 10M6 18C7.10457 18 8 17.1046 8 16C8 14.8954 7.10457 14 6 14M6 18C4.89543 18 4 17.1046 4 16C4 14.8954 4.89543 14 6 14M6 18V20M6 14V12M12 10V14M18 18C19.1046 18 20 17.1046 20 16C20 14.8954 19.1046 14 18 14M18 18C16.8954 18 16 17.1046 16 16C16 14.8954 16.8954 14 18 14M18 18V20M18 14V12M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16M12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16M12 20V22M12 16V14" />
          </svg>
          Estilo de formatação
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {styles.map(style => (
            <button
              key={style.id}
              type="button"
              onClick={() => handleStyleSelect(style.id)}
              className={`relative group overflow-hidden rounded-lg transition-all duration-300 border ${
                style.selected
                  ? 'bg-gradient-to-br from-rose-600 to-rose-700 border-rose-500 shadow-lg shadow-rose-500/20 transform scale-105'
                  : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/70 hover:border-gray-600'
              }`}
            >
              <div className="p-3 h-full flex flex-col justify-between">
                <div className="font-bold text-white">{style.name}</div>
                <div className={`text-xs mt-1 transition-opacity duration-200 ${style.selected ? 'text-rose-200' : 'text-gray-400'}`}>
                  {style.description}
                </div>
              </div>
              {style.selected && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-rose-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 relative group">
        <div className="flex justify-between items-center mb-3">
          <label 
            htmlFor="bibliography" 
            className="flex items-center text-rose-400 text-lg font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            Insira sua bibliografia
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              Colar
            </button>
            <button
              type="button"
              onClick={clearBibliography}
              className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              Limpar
            </button>
          </div>
        </div>
        <div className="relative">
          <textarea
            id="bibliography"
            className="w-full h-64 p-4 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 resize-none"
            placeholder="Cole sua bibliografia aqui para ser corrigida conforme as normas acadêmicas..."
            value={bibliography}
            onChange={handleBibliographyChange}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {charCount} caracteres
          </div>
          <div className="absolute inset-0 border border-rose-500/0 rounded-lg pointer-events-none group-focus-within:border-rose-500/50 transition-colors duration-300"></div>
        </div>
      </div>
      
      {/* Alerta sobre precisão da correção */}
      <div className="mb-5 p-4 bg-amber-900/30 border border-amber-700/50 rounded-lg text-amber-200 text-sm">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium mb-1">Aviso importante</p>
            <p>Nem mesmo o ChatGPT para correções bibliográficas é 100% preciso. Estamos constantemente aprimorando nosso modelo para oferecer maior precisão. Acesse nosso gerenciador de referências e contribua com a qualidade da ferramenta!</p>
            <a href="/referencias" className="inline-flex items-center mt-2 text-amber-400 hover:text-amber-300 transition-colors">
              <span>Acessar gerenciador de referências</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Formato selecionado: 
          <span className="ml-1 bg-gradient-to-r from-rose-500 to-orange-400 inline-block text-transparent bg-clip-text font-semibold">
            {getSelectedStyleInfo().name}
          </span>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !bibliography.trim()}
          className={`px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-rose-500 ${
            isSubmitting || !bibliography.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-center">
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                Corrigir Bibliografia
              </>
            )}
          </div>
        </button>
      </div>
    </form>
  );
};

export default BibliographyForm;