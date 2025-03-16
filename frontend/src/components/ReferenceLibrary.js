/**
 * Componente para gestão da biblioteca de referências bibliográficas
 * Permite cadastrar, visualizar e importar referências para melhorar o modelo de IA
 */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import apiService from '../services/apiService';
import ReferenceImporter from './ReferenceImporter';

const ReferenceLibrary = () => {
  const [activeTab, setActiveTab] = useState('visualizar');
  const [savedReferences, setSavedReferences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showJsonFormat, setShowJsonFormat] = useState(false);
  const jsonFileInputRef = useRef(null);
  
  const styleOptions = [
    { id: 'abnt', name: 'ABNT' },
    { id: 'apa', name: 'APA' },
    { id: 'vancouver', name: 'Vancouver' },
    { id: 'mla', name: 'MLA' }
  ];
  
  const typeOptions = [
    { id: 'book', name: 'Livro' },
    { id: 'article', name: 'Artigo' },
    { id: 'website', name: 'Website' },
    { id: 'thesis', name: 'Tese/Dissertação' },
    { id: 'conference', name: 'Congresso' }
  ];

  // Buscar referências salvas ao carregar o componente
  useEffect(() => {
    fetchReferences();
  }, []);
  
  // Buscar referências com os filtros aplicados
  useEffect(() => {
    // Implementar debounce para evitar múltiplas chamadas API
    const debounceTimer = setTimeout(() => {
      fetchReferences();
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedStyles, selectedTypes]);

  // Buscar referências da API
  const fetchReferences = async () => {
    setIsLoading(true);
    
    try {
      const filters = {
        search: searchTerm,
        styles: selectedStyles.length > 0 ? selectedStyles.join(',') : undefined,
        types: selectedTypes.length > 0 ? selectedTypes.join(',') : undefined
      };
      
      const result = await apiService.getReferences(filters);
      setSavedReferences(result.references || []);
    } catch (error) {
      console.error('Erro ao buscar referências:', error);
      setMessage({
        text: `Erro ao buscar referências: ${error.message || 'Erro desconhecido'}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Alternar seleção de filtro
  const toggleFilter = (id, type) => {
    if (type === 'style') {
      setSelectedStyles(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id) 
          : [...prev, id]
      );
    } else if (type === 'type') {
      setSelectedTypes(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id) 
          : [...prev, id]
      );
    }
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStyles([]);
    setSelectedTypes([]);
  };

  // Importar arquivo JSON
  const handleJsonImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        
        if (!Array.isArray(jsonData)) {
          throw new Error('O arquivo deve conter um array de referências');
        }
        
        setIsLoading(true);
        
        // Validar e processar referências
        const validationResult = await apiService.validateAndImportJson(jsonData);
        
        setMessage({
          text: `Importação concluída: ${validationResult.imported} referências importadas, ${validationResult.rejected} rejeitadas.`,
          type: validationResult.rejected > 0 ? 'warning' : 'success'
        });
        
        // Recarregar referências
        fetchReferences();
      } catch (error) {
        console.error('Erro ao importar JSON:', error);
        setMessage({
          text: `Erro ao importar JSON: ${error.message}`,
          type: 'error'
        });
      } finally {
        setIsLoading(false);
        if (jsonFileInputRef.current) {
          jsonFileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      setMessage({
        text: 'Erro ao ler o arquivo JSON',
        type: 'error'
      });
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">Biblioteca de Referências</h2>
          <p className="text-gray-400 mt-1">
            Nem tudo a IA resolve. Cadastre suas citações e contribua com o aprimoramento do modelo.
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500/30 to-pink-500/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Mensagem de feedback */}
      {message.text && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'error' ? 'bg-rose-900/50 text-rose-200' :
          message.type === 'success' ? 'bg-green-900/50 text-green-200' :
          'bg-amber-900/50 text-amber-200'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Abas */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`py-2 px-4 ${activeTab === 'visualizar' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('visualizar')}
        >
          Visualizar Referências
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'adicionar' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('adicionar')}
        >
          Adicionar Referências
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'importar' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('importar')}
        >
          Importar JSON
        </button>
      </div>
      
      {/* Aba de Visualização */}
      {activeTab === 'visualizar' && (
        <div>
          {/* Barra de busca e filtros */}
          <div className="mb-6">
            <div className="flex mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar referências..."
                  className="w-full rounded-md bg-gray-800 border-gray-700 text-white pl-10 pr-4 py-2"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
              </div>
              
              <button
                onClick={clearFilters}
                className="ml-2 px-3 py-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                disabled={!searchTerm && selectedStyles.length === 0 && selectedTypes.length === 0}
              >
                Limpar Filtros
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Estilo de Citação</h4>
                <div className="flex flex-wrap gap-2">
                  {styleOptions.map(style => (
                    <button
                      key={style.id}
                      className={`px-3 py-1 rounded-full text-xs ${
                        selectedStyles.includes(style.id)
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => toggleFilter(style.id, 'style')}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Tipo de Referência</h4>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map(type => (
                    <button
                      key={type.id}
                      className={`px-3 py-1 rounded-full text-xs ${
                        selectedTypes.includes(type.id)
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => toggleFilter(type.id, 'type')}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Lista de referências */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-4 border-gray-600 border-t-rose-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-400">Carregando referências...</span>
            </div>
          ) : savedReferences.length > 0 ? (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {savedReferences.map((ref) => (
                <motion.div
                  key={ref.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-rose-500/20 text-rose-300 mr-2">
                        {styleOptions.find(s => s.id === ref.style)?.name || ref.style.toUpperCase()}
                      </span>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                        {typeOptions.find(t => t.id === ref.type)?.name || ref.type}
                      </span>
                    </div>
                    {ref.createdAt && (
                      <span className="text-xs text-gray-500">
                        Adicionado em {new Date(ref.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div 
                    className="text-white text-sm mt-2"
                    dangerouslySetInnerHTML={{ __html: ref.formatted }}
                  />
                  
                  <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
                    {ref.authors && (
                      <div>
                        <span className="font-medium">Autores:</span> {ref.authors}
                      </div>
                    )}
                    {ref.year && (
                      <div>
                        <span className="font-medium">Ano:</span> {ref.year}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-gray-300 text-lg font-medium mb-2">Nenhuma referência encontrada</h3>
              <p className="text-gray-500">
                {selectedStyles.length > 0 || selectedTypes.length > 0 || searchTerm
                  ? 'Tente ajustar seus filtros de busca'
                  : 'Adicione referências para começar a biblioteca'}
              </p>
              {(selectedStyles.length > 0 || selectedTypes.length > 0 || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Aba de Adição */}
      {activeTab === 'adicionar' && (
        <div>
          <p className="text-gray-300 mb-6">
            Adicione referências bibliográficas em diferentes formatos para melhorar as correções e validações da IA.
          </p>
          
          <ReferenceImporter />
        </div>
      )}
      
      {/* Aba de Importação */}
      {activeTab === 'importar' && (
        <div>
          <p className="text-gray-300 mb-4">
            Importe várias referências de uma só vez através de um arquivo JSON estruturado.
          </p>
          
          <div className="bg-gray-800 rounded-lg p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Formato do Arquivo JSON</h3>
              <button
                onClick={() => setShowJsonFormat(!showJsonFormat)}
                className="text-gray-400 hover:text-rose-400"
              >
                {showJsonFormat ? 'Ocultar' : 'Mostrar'} Formato
              </button>
            </div>
            
            {showJsonFormat && (
              <div className="bg-gray-900 rounded-md p-4 overflow-x-auto text-sm">
                <pre className="text-gray-300">
{`[
  {
    "authors": "Sobrenome, Nome do Autor",
    "title": "Título da obra",
    "year": "2023",
    "publisher": "Editora",
    "place": "Local de publicação",
    "type": "book",    // Tipo: book, article, website, thesis, conference
    "style": "abnt",   // Estilo: abnt, apa, vancouver, mla
    
    // Campos opcionais específicos por tipo
    "edition": "2ª edição",   // Para livros
    
    // Para artigos
    "journal": "Nome do periódico",
    "volume": "5",
    "issue": "2",
    "pages": "123-145",
    "doi": "10.xxxx/xxxxx",
    
    // Para websites
    "url": "https://exemplo.com",
    "accessDate": "2023-06-15"
  },
  {
    // Segunda referência
  }
]`}
                </pre>
                
                <button
                  onClick={() => {
                    // Criar e baixar arquivo de exemplo
                    const exampleJson = [
                      {
                        "authors": "Silva, João; Oliveira, Maria",
                        "title": "Introdução à Metodologia Científica",
                        "year": "2022",
                        "publisher": "Editora Acadêmica",
                        "place": "São Paulo",
                        "edition": "3ª edição",
                        "type": "book",
                        "style": "abnt"
                      },
                      {
                        "authors": "Santos, Ana Paula",
                        "title": "Análise de Métodos de Pesquisa em Educação",
                        "year": "2021",
                        "journal": "Revista Brasileira de Educação",
                        "volume": "26",
                        "issue": "3",
                        "pages": "45-67",
                        "doi": "10.1590/S1413-24782021000300004",
                        "type": "article",
                        "style": "abnt"
                      }
                    ];
                    
                    const blob = new Blob([JSON.stringify(exampleJson, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'referencias_exemplo.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="mt-3 text-rose-400 hover:text-rose-300 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Baixar exemplo
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="text-white font-medium mb-4">Upload de Arquivo JSON</h3>
            
            <input
              type="file"
              ref={jsonFileInputRef}
              onChange={handleJsonImport}
              accept=".json"
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-rose-500 file:text-white
                hover:file:bg-rose-600"
              disabled={isLoading}
            />
            
            <p className="mt-3 text-xs text-gray-500">
              O arquivo deve estar no formato JSON válido e conter um array de objetos de referência conforme especificação acima.
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-rose-900/20 border border-rose-900/40 rounded-lg">
            <h3 className="text-rose-300 text-sm font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Importante
            </h3>
            <p className="text-gray-400 text-sm">
              Todas as referências importadas serão validadas antes de serem adicionadas à biblioteca.
              Referências com erros de formatação ou dados faltantes serão rejeitadas.
              Use o formato correto para cada tipo de referência e certifique-se de que os campos obrigatórios estão preenchidos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferenceLibrary; 