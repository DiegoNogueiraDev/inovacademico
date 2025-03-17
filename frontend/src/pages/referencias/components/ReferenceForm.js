/**
 * Componente de formulário para adicionar referências
 */
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ReferenceTypeFields from './ReferenceTypeFields';
import { salvarReferencia } from '../../../services/referencias';

const ReferenceForm = ({ onSuccess, onError, onMessage, setFormRef }) => {
  const router = useRouter();
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    tipo: 'livro',
    titulo: '',
    autores: '',
    ano: '',
    editora: '',
    local: '',
    edicao: '',
    volume: '',
    paginas: '',
    doi: '',
    url: '',
    dataAcesso: '',
    revista: '',
    numero: '',
    instituicao: '',
    evento: '',
    isbn: '',
    // Campos adicionais para novos tipos
    issn: '',
    nomePeriodico: '',
    mes: '',
    numeroLei: '',
    dataPublicacao: '',
    publicadoEm: '',
    secao: '',
    ementa: '',
    universidade: '',
    curso: '',
    paginasTotais: '',
    // Outros campos potencialmente necessários
    subtitulo: '',
    edicaoRevista: '',
    fasciculo: '',
    idioma: '',
    palavrasChave: '',
    notasAdicionais: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Expor a referência do formulário para o componente pai
  useEffect(() => {
    if (setFormRef && formRef.current) {
      setFormRef({
        current: formRef.current,
        applyFormatting: applyFormatting
      });
    }
  }, [setFormRef]);

  // Função para aplicar formatação a um campo específico
  const applyFormatting = (tag, campo) => {
    try {
      // Obter o elemento ativo ou específico
      const input = document.querySelector(`input[name="${campo}"]`) || 
                   document.querySelector(`textarea[name="${campo}"]`);
      
      if (!input) return false;
      
      // Verificar se há texto selecionado
      const start = input.selectionStart;
      const end = input.selectionEnd;
      
      if (start === end) return false; // Nenhum texto selecionado
      
      // Texto selecionado
      const selectedText = input.value.substring(start, end);
      
      // Aplicar formatação
      let formattedText = '';
      switch (tag) {
        case 'b':
          formattedText = `<b>${selectedText}</b>`;
          break;
        case 'em':
          formattedText = `<em>${selectedText}</em>`;
          break;
        case 'u':
          formattedText = `<u>${selectedText}</u>`;
          break;
        case 'quote':
          formattedText = `"${selectedText}"`;
          break;
        default:
          formattedText = selectedText;
      }
      
      // Atualizar o valor do campo
      const newValue = input.value.substring(0, start) + formattedText + input.value.substring(end);
      
      // Atualizar o estado do React
      setFormData(prev => ({
        ...prev,
        [campo]: newValue
      }));
      
      return true;
    } catch (error) {
      console.error('Erro ao aplicar formatação:', error);
      return false;
    }
  };
  
  // Aplicar exemplos formatados
  const applyExample = (tipo) => {
    try {
      if (tipo === 'livro') {
        setFormData(prev => ({
          ...prev,
          titulo: '<em>Título do Livro: um estudo abrangente</em>',
          autores: '<b>SOBRENOME</b>, Nome do Autor'
        }));
      } else if (tipo === 'artigo') {
        setFormData(prev => ({
          ...prev,
          titulo: '"Título do Artigo: uma análise científica"',
          autores: '<b>SOBRENOME</b>, Nome do Autor',
          nomePeriodico: '<em>Nome da Revista Científica</em>'
        }));
      }
      return true;
    } catch (error) {
      console.error('Erro ao aplicar exemplo:', error);
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para determinar campos obrigatórios por tipo
  const getRequiredFieldsByType = (tipo) => {
    // Campos obrigatórios comuns para todos os tipos
    const camposComuns = ['titulo', 'autores', 'ano'];
    
    // Adicionar campos específicos por tipo
    switch (tipo) {
      case 'livro':
        return [...camposComuns, 'editora', 'local'];
      case 'artigo':
      case 'revista':
        return [...camposComuns, 'nomePeriodico'];
      case 'site':
        return [...camposComuns, 'url', 'dataAcesso'];
      case 'lei':
        return [...camposComuns, 'numeroLei', 'dataPublicacao', 'publicadoEm'];
      case 'dissertacao':
      case 'tese':
        return [...camposComuns, 'universidade', 'local'];
      case 'conferencia':
        return [...camposComuns, 'evento', 'local'];
      default:
        return camposComuns;
    }
  };
  
  // Função para mostrar mensagens
  const showMessage = (text, type) => {
    try {
      if (onMessage) {
        // Usar onMessage se disponível
        onMessage(text, type);
      } else if (type === 'success' && onSuccess) {
        // Caso contrário, tentar usar onSuccess/onError
        onSuccess(text);
      } else if (type === 'error' && onError) {
        onError(text);
      } else {
        // Fallback para console e alert
        console.log(`${type}: ${text}`);
        if (type === 'error') {
          alert(`Erro: ${text}`);
        } else if (type === 'success') {
          alert(`Sucesso: ${text}`);
        }
      }
    } catch (error) {
      console.error('Erro ao mostrar mensagem:', error);
      alert(`${type === 'error' ? 'Erro' : 'Mensagem'}: ${text}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setErrors({});
      
      // Validação de campos obrigatórios baseado no tipo de referência
      const requiredFields = getRequiredFieldsByType(formData.tipo);
      const newErrors = {};
      
      requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
          newErrors[field] = `O campo ${field} é obrigatório para referências do tipo ${formData.tipo}`;
        }
      });
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        showMessage("Por favor, preencha todos os campos obrigatórios", "error");
        return;
      }
      
      console.log('Enviando dados do formulário:', formData);
      
      // Mapear campos do frontend para o formato esperado pelo backend
      const referenciaFormatada = {
        // Campos básicos
        title: formData.titulo,
        authors: formData.autores,
        year: formData.ano,
        publisher: formData.editora,
        location: formData.local,
        edition: formData.edicao,
        volume: formData.volume,
        pages: formData.paginas,
        doi: formData.doi,
        url: formData.url,
        accessDate: formData.dataAcesso,
        
        // Campos específicos
        journal: formData.nomePeriodico,
        issue: formData.numero,
        institution: formData.instituicao,
        event: formData.evento,
        isbn: formData.isbn,
        issn: formData.issn,
        
        // Campos adicionais
        subtitle: formData.subtitulo,
        language: formData.idioma,
        keywords: formData.palavrasChave,
        notes: formData.notasAdicionais,
        
        // Estilo de referência (padrão ABNT)
        style: 'abnt',
        
        // Tipo de referência
        type: formData.tipo
      };
      
      // Usando o serviço para salvar a referência
      const resultado = await salvarReferencia(referenciaFormatada);
      
      console.log('Resposta completa:', resultado);
      
      if (resultado.success) {
        console.log('Referência salva com sucesso:', resultado);
        showMessage("Referência salva com sucesso!", "success");
        
        // Limpar o formulário ao invés de redirecionar
        setFormData({
          tipo: 'livro',
          titulo: '',
          autores: '',
          ano: '',
          editora: '',
          local: '',
          edicao: '',
          volume: '',
          paginas: '',
          doi: '',
          url: '',
          dataAcesso: '',
          revista: '',
          numero: '',
          instituicao: '',
          evento: '',
          isbn: '',
          issn: '',
          nomePeriodico: '',
          mes: '',
          numeroLei: '',
          dataPublicacao: '',
          publicadoEm: '',
          secao: '',
          ementa: '',
          universidade: '',
          curso: '',
          paginasTotais: '',
          subtitulo: '',
          edicaoRevista: '',
          fasciculo: '',
          idioma: '',
          palavrasChave: '',
          notasAdicionais: ''
        });
        
        // Mostrar uma mensagem mais detalhada
        showMessage(`Referência '${referenciaFormatada.title}' salva com sucesso! Você pode adicionar mais referências ou voltar para a lista.`, "success");
        
        // Rolar para o topo do formulário
        window.scrollTo(0, 0);
        
        // Não redirecionar automaticamente
        // setTimeout(() => {
        //   router && router.push('/referencias');
        // }, 2000);
      } else {
        // Tratamento de erro mais detalhado
        let mensagemErro = "Erro ao salvar referência";
        
        if (resultado.message) {
          mensagemErro += `: ${resultado.message}`;
        }
        
        if (resultado.error && resultado.error !== resultado.message) {
          mensagemErro += ` (${resultado.error})`;
        }
        
        console.error('Erro ao salvar referência:', resultado);
        showMessage(mensagemErro, "error");
      }
    } catch (error) {
      console.error('Erro durante o envio do formulário:', error);
      showMessage(`Erro durante o envio: ${error.message || 'Erro desconhecido'}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para permitir a inserção de HTML nos campos quando 
  // usar os botões de formatação
  const handleInputChange = (e) => {
    try {
      const { name, value } = e.target;
      
      // Atualizar o estado do formulário com o novo valor
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    } catch (error) {
      console.error('Erro ao processar entrada:', error);
    }
  };

  // Função para renderizar campos que aceitam HTML
  const renderHtmlPreview = (content) => {
    // Garantir que sempre retorne um objeto com a propriedade __html
    return { __html: content || '' };
  };

  // Melhorar o tratamento do botão cancelar
  const handleCancel = () => {
    try {
      if (router && router.back) {
        router.back();
      } else {
        // Fallback caso router não esteja disponível
        window.history.back();
      }
    } catch (error) {
      console.error('Erro ao navegar:', error);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="bg-gray-900/50 rounded-lg p-4 sm:p-6 border border-gray-700">
        <div className="mb-4">
          <label htmlFor="tipo" className="block text-gray-300 mb-1 font-medium">Tipo de Referência*</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
            required
          >
            <option value="livro">Livro</option>
            <option value="artigo">Artigo Científico</option>
            <option value="revista">Revista/Periódico</option>
            <option value="site">Site/Página Web</option>
            <option value="conferencia">Artigo de Conferência</option>
            <option value="lei">Lei/Legislação</option>
            <option value="dissertacao">Dissertação/Tese</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Título*</label>
          <input
            type="text"
            name="titulo"
            onChange={handleInputChange}
            value={formData.titulo || ''}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            placeholder="Ex: A História da Ciência"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-300 mb-2">Autor(es)*</label>
            <input
              type="text"
              name="autores"
              onChange={handleInputChange}
              value={formData.autores || ''}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              placeholder="Ex: Silva, João; Pereira, Maria"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Ano*</label>
            <input
              type="text"
              name="ano"
              onChange={handleInputChange}
              value={formData.ano || ''}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              placeholder="Ex: 2023"
              required
            />
          </div>
        </div>

        {/* Campos específicos por tipo de referência */}
        <ReferenceTypeFields formData={formData} handleChange={handleInputChange} />
        
        {/* Campos adicionais para todos os tipos */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h3 className="text-gray-300 font-medium mb-3">Campos Adicionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="idioma" className="block text-gray-300 mb-1 font-medium">Idioma</label>
              <input
                type="text"
                id="idioma"
                name="idioma"
                value={formData.idioma}
                onChange={handleInputChange}
                placeholder="Ex: Português"
                className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="palavrasChave" className="block text-gray-300 mb-1 font-medium">Palavras-chave</label>
              <input
                type="text"
                id="palavrasChave"
                name="palavrasChave"
                value={formData.palavrasChave}
                onChange={handleInputChange}
                placeholder="Ex: educação; tecnologia; inovação"
                className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="notasAdicionais" className="block text-gray-300 mb-1 font-medium">Notas Adicionais</label>
            <textarea
              id="notasAdicionais"
              name="notasAdicionais"
              value={formData.notasAdicionais}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg mb-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-rose-500">Visualização da Formatação</h2>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Título com Formatação:</label>
          <div 
            className="p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
            dangerouslySetInnerHTML={renderHtmlPreview(formData.titulo)}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 mb-2">Autor(es) com Formatação:</label>
            <div 
              className="p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
              dangerouslySetInnerHTML={renderHtmlPreview(formData.autores)}
            ></div>
          </div>
          {formData.tipo === 'revista' && formData.nomePeriodico && (
            <div>
              <label className="block text-gray-300 mb-2">Periódico com Formatação:</label>
              <div 
                className="p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
                dangerouslySetInnerHTML={renderHtmlPreview(formData.nomePeriodico)}
              ></div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 mt-3 sm:mt-0"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center ${isSubmitting ? 'opacity-90 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="relative">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-white rounded-full opacity-25"></div>
              </div>
              <span>Salvando...</span>
            </div>
          ) : (
            <>
              <img src="/check-animated.svg" alt="Verificação" className="h-4 w-4 mr-1" />
              Salvar Referência
            </>
          )}
        </button>
      </div>

      <div className="mt-8 sm:mt-10 p-4 sm:p-5 bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-lg border border-gray-700">
        <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Dicas para adicionar referências:</h3>
        <ul className="text-gray-300 space-y-1 sm:space-y-2 list-disc pl-5 text-sm sm:text-base">
          <li>Preencha o máximo de campos possível para garantir uma referência completa</li>
          <li>Para livros, o local de publicação geralmente refere-se à cidade onde a editora está localizada</li>
          <li>Para artigos científicos, fornecer o DOI facilita a localização precisa do documento</li>
          <li>Para sites, sempre inclua a data de acesso, pois o conteúdo pode mudar com o tempo</li>
          <li>Para leis, inclua o número completo e a data de publicação oficial</li>
          <li>Se preferir importar várias referências de uma vez, utilize a opção "Importar Referências"</li>
        </ul>
      </div>
    </form>
  );
};

export default ReferenceForm; 