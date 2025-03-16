/**
 * Componente para importação de referências bibliográficas
 * Suporta entrada manual e upload de arquivos em vários formatos
 */
import { useState, useRef } from 'react';
import apiService from '../services/apiService';

// Tipos de normas suportadas
const CITATION_STYLES = [
  { id: 'abnt', name: 'ABNT' },
  { id: 'apa', name: 'APA' },
  { id: 'vancouver', name: 'Vancouver' },
  { id: 'mla', name: 'MLA' }
];

// Componente principal
const ReferenceImporter = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [referenceType, setReferenceType] = useState('book');
  const [citationStyle, setCitationStyle] = useState('abnt');
  const [references, setReferences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);
  
  // Campos para cada tipo de referência
  const [formData, setFormData] = useState({
    // Campos comuns
    authors: '',
    title: '',
    year: '',
    
    // Livro
    publisher: '',
    place: '',
    edition: '',
    
    // Artigo
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    
    // Website
    url: '',
    accessDate: '',
    
    // Outros campos...
    institution: '',
    department: '',
    type: '',
  });
  
  // Atualizar campo do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Validar referência conforme a norma selecionada
  const validateReference = (data, style) => {
    let errors = [];
    
    // Validações básicas
    if (!data.title) errors.push('Título é obrigatório');
    
    // Validações específicas por estilo
    switch (style) {
      case 'abnt':
        if (!data.authors) errors.push('Autor(es) são obrigatórios para ABNT');
        if (!data.year) errors.push('Ano é obrigatório para ABNT');
        
        if (referenceType === 'book' && !data.publisher) {
          errors.push('Editora é obrigatória para livros na ABNT');
        }
        break;
        
      case 'apa':
        if (!data.authors) errors.push('Autor(es) são obrigatórios para APA');
        // Outras validações APA
        break;
        
      case 'vancouver':
        // Validações Vancouver
        break;
        
      case 'mla':
        // Validações MLA
        break;
    }
    
    return errors;
  };
  
  // Formatar referência conforme a norma
  const formatReference = (data, style) => {
    const authors = data.authors ? data.authors.split(',').map(a => a.trim()) : [];
    
    switch (style) {
      case 'abnt':
        return formatAbntReference(data, authors);
      case 'apa':
        return formatApaReference(data, authors);
      case 'vancouver':
        return formatVancouverReference(data, authors);
      case 'mla':
        return formatMlaReference(data, authors);
      default:
        return 'Formato não suportado';
    }
  };
  
  // Formatadores específicos para cada norma
  const formatAbntReference = (data, authors) => {
    // Livro ABNT: SOBRENOME, Nome. Título: subtítulo. Edição. Local: Editora, Ano.
    if (referenceType === 'book') {
      const authorStr = authors.map(author => {
        const parts = author.split(' ');
        if (parts.length > 1) {
          const lastName = parts.pop().toUpperCase();
          return `${lastName}, ${parts.join(' ')}`;
        }
        return author.toUpperCase();
      }).join('; ');
      
      let reference = `${authorStr}. `;
      reference += `<strong>${data.title}</strong>. `;
      
      if (data.edition) reference += `${data.edition}. `;
      if (data.place) reference += `${data.place}: `;
      if (data.publisher) reference += `${data.publisher}, `;
      if (data.year) reference += `${data.year}.`;
      
      return reference;
    }
    
    // Artigo ABNT
    if (referenceType === 'article') {
      const authorStr = authors.map(author => {
        const parts = author.split(' ');
        if (parts.length > 1) {
          const lastName = parts.pop().toUpperCase();
          return `${lastName}, ${parts.join(' ')}`;
        }
        return author.toUpperCase();
      }).join('; ');
      
      let reference = `${authorStr}. `;
      reference += `${data.title}. `;
      reference += `<strong>${data.journal}</strong>, `;
      
      if (data.place) reference += `${data.place}, `;
      if (data.volume) reference += `v. ${data.volume}, `;
      if (data.issue) reference += `n. ${data.issue}, `;
      if (data.pages) reference += `p. ${data.pages}, `;
      if (data.year) reference += `${data.year}`;
      
      if (data.doi) reference += `. DOI: ${data.doi}`;
      
      reference += '.';
      
      return reference;
    }
    
    // Site ABNT
    if (referenceType === 'website') {
      const authorStr = authors.length ? authors.map(author => {
        const parts = author.split(' ');
        if (parts.length > 1) {
          const lastName = parts.pop().toUpperCase();
          return `${lastName}, ${parts.join(' ')}`;
        }
        return author.toUpperCase();
      }).join('; ') + '. ' : '';
      
      let reference = authorStr;
      reference += `<strong>${data.title}</strong>. `;
      
      if (data.year) reference += `${data.year}. `;
      if (data.url) reference += `Disponível em: ${data.url}. `;
      if (data.accessDate) reference += `Acesso em: ${data.accessDate}.`;
      
      return reference;
    }
    
    return 'Tipo de referência não suportado para ABNT';
  };
  
  const formatApaReference = (data, authors) => {
    // Implementação de formatação APA
    return 'Formatação APA não implementada completamente';
  };
  
  const formatVancouverReference = (data, authors) => {
    // Implementação de formatação Vancouver
    return 'Formatação Vancouver não implementada completamente';
  };
  
  const formatMlaReference = (data, authors) => {
    // Implementação de formatação MLA
    return 'Formatação MLA não implementada completamente';
  };
  
  // Adicionar referência manualmente
  const handleAddReference = () => {
    // Validar
    const errors = validateReference(formData, citationStyle);
    
    if (errors.length > 0) {
      setMessage({
        text: `Erros: ${errors.join(', ')}`,
        type: 'error'
      });
      return;
    }
    
    // Formatar
    const formattedReference = formatReference(formData, citationStyle);
    
    // Adicionar à lista
    const newReference = {
      ...formData,
      id: Date.now().toString(),
      style: citationStyle,
      type: referenceType,
      formatted: formattedReference
    };
    
    setReferences([...references, newReference]);
    
    // Limpar formulário
    resetForm();
    
    setMessage({
      text: 'Referência adicionada com sucesso!',
      type: 'success'
    });
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };
  
  // Limpar formulário
  const resetForm = () => {
    setFormData({
      authors: '',
      title: '',
      year: '',
      publisher: '',
      place: '',
      edition: '',
      journal: '',
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      url: '',
      accessDate: '',
      institution: '',
      department: '',
      type: '',
    });
  };
  
  // Upload de arquivo
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('style', citationStyle);
    
    setIsLoading(true);
    
    try {
      // Chamar API para processar arquivo
      const result = await apiService.uploadReferences(formData);
      
      if (result.references && result.references.length > 0) {
        setReferences([...references, ...result.references]);
        setMessage({
          text: `${result.references.length} referências importadas com sucesso!`,
          type: 'success'
        });
      } else {
        setMessage({
          text: 'Nenhuma referência válida encontrada no arquivo.',
          type: 'warning'
        });
      }
    } catch (error) {
      console.error('Erro ao importar referências:', error);
      setMessage({
        text: `Erro ao importar: ${error.message || 'Erro desconhecido'}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
      // Limpar input de arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Salvar todas as referências no banco
  const handleSaveAll = async () => {
    if (references.length === 0) {
      setMessage({
        text: 'Nenhuma referência para salvar.',
        type: 'warning'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Chamar API para salvar referências
      await apiService.saveReferences(references);
      
      setMessage({
        text: `${references.length} referências salvas com sucesso!`,
        type: 'success'
      });
      
      // Limpar lista após salvar
      setReferences([]);
    } catch (error) {
      console.error('Erro ao salvar referências:', error);
      setMessage({
        text: `Erro ao salvar: ${error.message || 'Erro desconhecido'}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remover referência
  const handleRemoveReference = (id) => {
    setReferences(references.filter(ref => ref.id !== id));
  };
  
  // Renderizar campos específicos por tipo de referência
  const renderTypeSpecificFields = () => {
    switch (referenceType) {
      case 'book':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Editora</label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Local de Publicação</label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Edição</label>
                <input
                  type="text"
                  name="edition"
                  value={formData.edition}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </>
        );
        
      case 'article':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Periódico/Revista</label>
              <input
                type="text"
                name="journal"
                value={formData.journal}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Volume</label>
                <input
                  type="text"
                  name="volume"
                  value={formData.volume}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Número</label>
                <input
                  type="text"
                  name="issue"
                  value={formData.issue}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Páginas</label>
                <input
                  type="text"
                  name="pages"
                  value={formData.pages}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
                  placeholder="ex: 45-67"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">DOI</label>
              <input
                type="text"
                name="doi"
                value={formData.doi}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </>
        );
        
      case 'website':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Data de Acesso</label>
              <input
                type="date"
                name="accessDate"
                value={formData.accessDate}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Importador de Referências</h2>
      
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
      <div className="flex mb-4 border-b border-gray-700">
        <button
          className={`py-2 px-4 ${activeTab === 'manual' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('manual')}
        >
          Entrada Manual
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'upload' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload de Arquivo
        </button>
      </div>
      
      {/* Seleção de estilo de citação */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Estilo de Citação</label>
        <div className="flex space-x-2">
          {CITATION_STYLES.map(style => (
            <button
              key={style.id}
              className={`px-3 py-1 rounded-full text-xs ${
                citationStyle === style.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setCitationStyle(style.id)}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Entrada Manual */}
      {activeTab === 'manual' && (
        <div>
          {/* Seleção de tipo de referência */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Referência</label>
            <select
              value={referenceType}
              onChange={(e) => setReferenceType(e.target.value)}
              className="w-full rounded-md bg-gray-700 border-gray-600 text-white"
            >
              <option value="book">Livro</option>
              <option value="article">Artigo</option>
              <option value="website">Website</option>
              <option value="thesis">Tese/Dissertação</option>
              <option value="conference">Anais de Congresso</option>
            </select>
          </div>
          
          {/* Campos comuns */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Autor(es)</label>
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
              placeholder="Nome Sobrenome, Nome Sobrenome"
            />
            <p className="text-xs text-gray-400 mt-1">Separe múltiplos autores com vírgula</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Ano</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          {/* Campos específicos por tipo */}
          {renderTypeSpecificFields()}
          
          {/* Botão para adicionar */}
          <button
            onClick={handleAddReference}
            className="mt-4 w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : 'Adicionar Referência'}
          </button>
        </div>
      )}
      
      {/* Upload de Arquivo */}
      {activeTab === 'upload' && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload de Arquivo</label>
            <p className="text-xs text-gray-400 mb-2">Formatos suportados: BibTeX (.bib), EndNote (.enw), RIS (.ris), CSV</p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".bib,.enw,.ris,.csv,.txt"
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-rose-500 file:text-white
                hover:file:bg-rose-600"
              disabled={isLoading}
            />
          </div>
        </div>
      )}
      
      {/* Lista de Referências */}
      {references.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Referências ({references.length})</h3>
            <button
              onClick={handleSaveAll}
              className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-md text-sm transition-colors"
              disabled={isLoading}
            >
              Salvar Todas
            </button>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto px-2">
            {references.map((ref) => (
              <div key={ref.id} className="bg-gray-700 rounded-md p-3 relative">
                <div className="flex justify-between">
                  <div className="text-xs text-gray-400 mb-1 uppercase">
                    {ref.style.toUpperCase()} | {ref.type}
                  </div>
                  <button
                    onClick={() => handleRemoveReference(ref.id)}
                    className="text-gray-400 hover:text-rose-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div 
                  className="text-white text-sm" 
                  dangerouslySetInnerHTML={{ __html: ref.formatted }} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferenceImporter; 