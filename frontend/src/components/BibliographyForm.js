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
    { id: 'abnt', name: 'ABNT', selected: true },
    { id: 'apa', name: 'APA', selected: false },
    { id: 'vancouver', name: 'Vancouver', selected: false },
    { id: 'mla', name: 'MLA', selected: false }
  ]);

  useEffect(() => {
    if (initialValue) {
      setBibliography(initialValue);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bibliography.trim()) {
      setError('Por favor, insira uma bibliografia para corrigir.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiService.correctBibliography(bibliography, getSelectedStyle());
      onCorrectionResult(result);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao corrigir a bibliografia. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBibliographyChange = (e) => {
    const value = e.target.value;
    setBibliography(value);
    if (setInputValue) {
      setInputValue(value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label 
          htmlFor="style" 
          className="block text-green-400 text-lg font-medium mb-2"
        >
          Estilo de formatação:
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {styles.map(style => (
            <button
              key={style.id}
              type="button"
              onClick={() => handleStyleSelect(style.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                style.selected
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label 
          htmlFor="bibliography" 
          className="block text-green-400 text-lg font-medium mb-2"
        >
          Insira sua bibliografia:
        </label>
        <textarea
          id="bibliography"
          className="w-full h-60 p-4 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Cole sua bibliografia aqui para ser corrigida conforme as normas acadêmicas..."
          value={bibliography}
          onChange={handleBibliographyChange}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Formato selecionado: <span className="text-purple-400 font-semibold">{styles.find(s => s.selected).name}</span>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-md shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Corrigir Bibliografia
        </button>
      </div>
    </form>
  );
};

export default BibliographyForm;