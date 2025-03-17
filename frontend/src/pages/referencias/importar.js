/**
 * File: inovacademico/frontend/src/pages/referencias/importar.js
 * Página para importar referências em lote
 */
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ImportarReferencias() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [formato, setFormato] = useState('bibtex');
  const [texto, setTexto] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [preservarHTML, setPreservarHTML] = useState(true);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (message.text) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    
    if (!file) {
      setFileName('');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setFileError('O arquivo é muito grande. O tamanho máximo é 5MB.');
      e.target.value = '';
      setFileName('');
      return;
    }

    const allowedTypes = [
      'application/json',
      'text/plain',
      'text/x-bibtex',
      'application/x-bibtex',
      'application/x-research-info-systems',
      'text/x-research-info-systems',
      '',  // Alguns navegadores podem não definir um tipo
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(bib|json|ris|txt|html)$/i)) {
      setFileError('Formato de arquivo não suportado. Por favor, envie um arquivo BibTeX, RIS, JSON, TXT ou HTML.');
      e.target.value = '';
      setFileName('');
      return;
    }

    // Detectar formato com base na extensão
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'bib') setFormato('bibtex');
    else if (extension === 'ris') setFormato('ris');
    else if (extension === 'json') setFormato('json');
    else if (extension === 'html') setFormato('html');
    
    setFileName(file.name);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Verificar se há dados para processar
      if (activeTab === 'upload' && !fileName) {
        throw new Error('Nenhum arquivo selecionado para importação.');
      }
      
      if (activeTab === 'texto' && !texto) {
        throw new Error('Nenhum texto para importação.');
      }
      
      // Verificar se o formato foi selecionado
      if (!formato) {
        throw new Error('Selecione um formato de importação.');
      }
      
      // Dados para enviar à API
      let dadosParaEnviar;
      let endpoint;
      
      if (activeTab === 'upload') {
        // Obter o arquivo do input
        const arquivo = fileInputRef.current.files[0];
        if (!arquivo) {
          throw new Error('Arquivo não encontrado.');
        }
        
        // Criar FormData para enviar arquivo
        const formData = new FormData();
        formData.append('arquivo', arquivo);
        formData.append('formato', formato);
        formData.append('preservarHTML', preservarHTML);
        
        endpoint = '/api/referencias/importar/arquivo';
        dadosParaEnviar = formData;
      } else {
        // Processar texto
        endpoint = '/api/referencias/importar/texto';
        dadosParaEnviar = {
          texto,
          formato,
          preservarHTML
        };
      }
      
      // Fazer requisição à API
      const opcoes = {
        method: 'POST',
        headers: {},
        // Não definir Content-Type para FormData, o navegador faz isso automaticamente
        // com o boundary correto. Para JSON, definimos abaixo.
      };
      
      // Se não for FormData, converter para JSON
      if (activeTab === 'texto') {
        opcoes.headers['Content-Type'] = 'application/json';
        opcoes.body = JSON.stringify(dadosParaEnviar);
      } else {
        opcoes.body = dadosParaEnviar;
      }
      
      const resposta = await fetch(endpoint, opcoes);
      
      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.mensagem || 'Erro ao importar referências');
      }
      
      const resultado = await resposta.json();
      
      // Sucesso
      setMessage({
        type: 'success',
        text: activeTab === 'upload' 
          ? `${fileName} importado com sucesso! ${resultado.importadas} referências adicionadas.` 
          : `Referências importadas com sucesso! ${resultado.importadas} referências adicionadas.`
      });
      
      // Limpar formulário
      if (activeTab === 'texto') {
        setTexto('');
      } else {
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error) {
      // Tratamento de erro
      console.error('Erro ao importar referências:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Erro ao importar referências. Verifique o formato e tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
      setShowAlert(true);
    }
  };

  // Função para aplicar formatação ao texto selecionado
  const aplicarFormatacao = (tipo) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textoSelecionado = textarea.value.substring(start, end);
    
    if (start === end) {
      setMessage({
        type: 'error',
        text: 'Selecione o texto que deseja formatar'
      });
      return;
    }

    let tag = '';
    switch (tipo) {
      case 'negrito':
        tag = 'b';
        break;
      case 'italico':
        tag = 'em';
        break;
      case 'sublinhado':
        tag = 'u';
        break;
      default:
        return;
    }

    const novoTexto = `<${tag}>${textoSelecionado}</${tag}>`;
    const textoAnterior = textarea.value.substring(0, start);
    const textoPosterior = textarea.value.substring(end);
    const novoValor = textoAnterior + novoTexto + textoPosterior;
    
    setTexto(novoValor);
    
    // Restaurar a seleção (posicionada após a tag inserida)
    setTimeout(() => {
      const newPosition = start + novoTexto.length;
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 10);
  };

  // Função auxiliar para renderizar o alerta com o tema da aplicação
  const renderAlert = () => {
    if (!message.text) return null;
    
    const isSuccess = message.type === 'success';
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
          <p className="text-sm text-gray-100">{message.text}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      <Head>
        <title>Importar Referências - InovAcadêmico</title>
        <meta name="description" content="Importe referências bibliográficas em lote no InovAcadêmico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      {/* Alerta personalizado */}
      {renderAlert()}

      {/* Banner informativo - Melhorado para responsividade */}
      {showBanner && (
        <div className="relative bg-gradient-to-r from-rose-900/80 via-gray-800/90 to-gray-900/80 text-white py-3 px-4 shadow-md">
          <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-start sm:items-center mb-3 sm:mb-0 pr-8 sm:pr-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-300 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm">
                <span className="font-medium">Você pode usar o chatGPT ou outra, mas nenhuma é 100% precisa</span>, por isso, estamos convidando você a ajudar a gente a melhorar cada vez mais. Cadastre suas referências em nossa plataforma e usaremos elas como base para aprimorar o nosso modelo.
              </p>
            </div>
            <button 
              onClick={() => setShowBanner(false)} 
              className="absolute top-3 right-4 sm:static bg-rose-800/40 hover:bg-rose-800/60 rounded-full p-1 transition-colors"
            >
              <img src="/close-animated.svg" alt="Fechar" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header simplificado */}
      <header className="relative z-10 bg-gradient-to-r from-rose-900/80 to-gray-900/80 backdrop-blur-md shadow-lg border-b border-rose-900/30">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mr-2 sm:mr-3">
              <img src="/graduation-cap-theme.svg" alt="InovAcadêmico Logo" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">InovAcadêmico</h1>
              <div className="relative">
                <p className="text-rose-400 text-xs font-medium">Correção de bibliografias</p>
              </div>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white relative inline-block mb-4 sm:mb-0">
              Importar Referências
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-orange-500 to-transparent rounded-full"></div>
            </h2>
            <Link href="/referencias/adicionar" className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar manualmente
            </Link>
          </div>

          {/* Versão inline do alerta (para referência) */}
          {message.text && (
            <div className={`mb-6 p-3 sm:p-4 rounded-lg border-l-4 transform transition-all duration-300 ${
              message.type === 'success' 
                ? 'bg-gradient-to-r from-rose-900/50 to-rose-800/30 border-rose-500 text-rose-100' 
                : 'bg-gradient-to-r from-red-900/50 to-red-800/30 border-red-500 text-red-100'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <div className="h-8 w-8 rounded-full bg-rose-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <img src="/check-animated.svg" alt="Sucesso" className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                        <animate 
                          attributeName="stroke-dasharray" 
                          values="1, 150; 90, 150; 90, 150" 
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
                )}
                <div>
                  <h4 className="font-medium">{message.type === 'success' ? "Sucesso!" : "Erro"}</h4>
                  <p className="text-sm opacity-90">{message.text}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-900/50 rounded-lg p-4 sm:p-6 border border-gray-700">
            <div className="flex border-b border-gray-700 mb-4 sm:mb-6 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'upload'
                    ? 'text-rose-400 border-b-2 border-rose-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Enviar Arquivo
              </button>
              <button
                onClick={() => setActiveTab('texto')}
                className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'texto'
                    ? 'text-rose-400 border-b-2 border-rose-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Colar Texto
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === 'upload' ? (
                <>
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2 font-medium">Formato do Arquivo</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                      <div 
                        className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg cursor-pointer transition-colors text-center ${
                          formato === 'bibtex' 
                            ? 'bg-rose-900/50 text-white border-rose-500' 
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                        onClick={() => setFormato('bibtex')}
                      >
                        <div className="font-medium text-sm sm:text-base">BibTeX</div>
                        <div className="text-xs mt-1 text-gray-400">.bib</div>
                      </div>
                      <div 
                        className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg cursor-pointer transition-colors text-center ${
                          formato === 'ris' 
                            ? 'bg-rose-900/50 text-white border-rose-500' 
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                        onClick={() => setFormato('ris')}
                      >
                        <div className="font-medium text-sm sm:text-base">RIS</div>
                        <div className="text-xs mt-1 text-gray-400">.ris</div>
                      </div>
                      <div 
                        className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg cursor-pointer transition-colors text-center ${
                          formato === 'json' 
                            ? 'bg-rose-900/50 text-white border-rose-500' 
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                        onClick={() => setFormato('json')}
                      >
                        <div className="font-medium text-sm sm:text-base">JSON</div>
                        <div className="text-xs mt-1 text-gray-400">.json</div>
                      </div>
                      <div 
                        className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg cursor-pointer transition-colors text-center ${
                          formato === 'plain' 
                            ? 'bg-rose-900/50 text-white border-rose-500' 
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                        onClick={() => setFormato('plain')}
                      >
                        <div className="font-medium text-sm sm:text-base">Texto</div>
                        <div className="text-xs mt-1 text-gray-400">.txt</div>
                      </div>
                      <div 
                        className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg cursor-pointer transition-colors text-center ${
                          formato === 'html' 
                            ? 'bg-rose-900/50 text-white border-rose-500' 
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                        onClick={() => setFormato('html')}
                      >
                        <div className="font-medium text-sm sm:text-base">HTML</div>
                        <div className="text-xs mt-1 text-gray-400">.html</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      id="preservarHTML"
                      name="preservarHTML"
                      checked={preservarHTML}
                      onChange={(e) => setPreservarHTML(e.target.checked)}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-700 rounded bg-gray-800"
                    />
                    <label htmlFor="preservarHTML" className="ml-2 text-gray-300 text-sm">
                      Preservar formatação HTML (<b>negrito</b>, <em>itálico</em>, etc.) nas referências
                    </label>
                  </div>

                  <div className="mb-6">
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept=".bib,.ris,.json,.txt,.html" 
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    
                    <div 
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-8 md:p-10 text-center cursor-pointer hover:border-gray-500 transition-colors"
                    >
                      {fileName ? (
                        <div className="space-y-2">
                          <img src="/upload-animated.svg" alt="Upload" className="h-12 w-12 sm:h-14 sm:w-14 mx-auto" />
                          <div className="text-gray-300 font-medium text-sm sm:text-base break-all">{fileName}</div>
                          <div className="text-rose-400 text-xs sm:text-sm">Clique para alterar o arquivo</div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <img src="/upload-animated.svg" alt="Upload" className="h-12 w-12 sm:h-14 sm:w-14 mx-auto" />
                          <div className="text-gray-300 font-medium text-xs sm:text-sm md:text-base">Clique para selecionar um arquivo ou arraste e solte aqui</div>
                          <div className="text-gray-500 text-xs sm:text-sm">Suportamos BibTeX, RIS, JSON, TXT e HTML (máx. 5MB)</div>
                        </div>
                      )}
                    </div>
                    
                    {fileError && (
                      <div className="mt-2 bg-rose-900/30 border-l-2 border-rose-500 pl-3 py-2 rounded text-rose-200 text-xs sm:text-sm flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                            <animate 
                              attributeName="stroke-dasharray" 
                              values="1, 150; 90, 150; 90, 150" 
                              dur="1.5s" 
                              repeatCount="1" 
                            />
                            <animate
                              attributeName="opacity"
                              values="0.7; 1; 0.7"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </path>
                        </svg>
                        <span>{fileError}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2 font-medium">Formato do Texto</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                      <div 
                        className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg cursor-pointer transition-colors text-center ${
                          formato === 'bibtex' 
                            ? 'bg-rose-900/50 text-white border-rose-500' 
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                        onClick={() => setFormato('bibtex')}
                      >
                        <div className="font-medium text-sm sm:text-base">BibTeX</div>
                      </div>
                      <div 
                        className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg cursor-pointer transition-colors text-center ${
                          formato === 'ris' 
                            ? 'bg-rose-900/50 text-white border-rose-500' 
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                        onClick={() => setFormato('ris')}
                      >
                        <div className="font-medium text-sm sm:text-base">RIS</div>
                      </div>
                      <div 
                        className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg cursor-pointer transition-colors text-center ${
                          formato === 'json' 
                            ? 'bg-rose-900/50 text-white border-rose-500' 
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                        onClick={() => setFormato('json')}
                      >
                        <div className="font-medium text-sm sm:text-base">JSON</div>
                      </div>
                      <div 
                        className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg cursor-pointer transition-colors text-center ${
                          formato === 'plain' 
                            ? 'bg-rose-900/50 text-white border-rose-500' 
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                        onClick={() => setFormato('plain')}
                      >
                        <div className="font-medium text-sm sm:text-base">Texto</div>
                      </div>
                      <div 
                        className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg cursor-pointer transition-colors text-center ${
                          formato === 'html' 
                            ? 'bg-rose-900/50 text-white border-rose-500' 
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        }`}
                        onClick={() => setFormato('html')}
                      >
                        <div className="font-medium text-sm sm:text-base">HTML</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="texto" className="block text-gray-300 mb-2 font-medium flex flex-col sm:flex-row sm:items-center">
                      <span>Cole suas referências abaixo</span>
                      <span className="text-xs mt-1 sm:mt-0 sm:ml-2 text-gray-400">(máximo 5000 caracteres)</span>
                    </label>
                    {formato === 'html' || formato === 'plain' ? (
                      <div className="mb-2 flex flex-wrap gap-2">
                        <button 
                          type="button" 
                          onClick={() => aplicarFormatacao('negrito')}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm flex items-center transition-colors"
                        >
                          <span className="font-bold mr-1">B</span>
                          <span className="text-xs">Negrito</span>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => aplicarFormatacao('italico')}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm flex items-center transition-colors"
                        >
                          <span className="italic mr-1">I</span>
                          <span className="text-xs">Itálico</span>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => aplicarFormatacao('sublinhado')}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm flex items-center transition-colors"
                        >
                          <span className="underline mr-1">U</span>
                          <span className="text-xs">Sublinhado</span>
                        </button>
                      </div>
                    ) : null}
                    <textarea
                      id="texto"
                      name="texto"
                      ref={textareaRef}
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      rows={8}
                      maxLength={5000}
                      placeholder={
                        formato === 'bibtex' 
                          ? '@article{key2023,\n  author = {Sobrenome, Nome},\n  title = {Título do artigo},\n  journal = {Nome da revista},\n  year = {2023}\n}'
                          : formato === 'json'
                            ? '[\n  {\n    "author": "Sobrenome, Nome",\n    "title": "Título do livro",\n    "year": 2023,\n    "formatted": "<p>SOBRENOME, Nome. <b>Título do livro</b>. Editora, 2023.</p>"\n  }\n]'
                            : formato === 'ris'
                              ? 'TY  - JOUR\nAU  - Sobrenome, Nome\nTI  - Título do artigo\nJO  - Nome da revista\nPY  - 2023\nER  -'
                              : formato === 'html'
                                ? '<p>SOBRENOME, Nome. <b>Título do livro</b>. Editora, 2023.</p>\n<p>SOBRENOME, Nome. Título do artigo. <b>Nome da revista</b>, v. 10, n. 2, p. 45-67, 2023.</p>'
                                : 'SOBRENOME, Nome. Título do livro. Editora, 2023.\nSOBRENOME, Nome. Título do artigo. Nome da revista, v. 10, n. 2, p. 45-67, 2023.'
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white font-mono text-xs sm:text-sm"
                      required
                    />
                    <div className="mt-1 text-right text-xs text-gray-500">
                      {texto.length}/5000 caracteres
                    </div>
                    {preservarHTML && (
                      <div className="mt-2 bg-rose-900/30 border-l-2 border-rose-500 pl-3 py-2 rounded text-rose-200 text-xs sm:text-sm">
                        <p>Você pode usar tags HTML para formatação como:</p>
                        <ul className="list-disc ml-5 mt-1 space-y-1">
                          <li><code>&lt;b&gt;</code> para <b>negrito</b> (títulos de revistas, livros)</li>
                          <li><code>&lt;em&gt;</code> para <em>itálico</em> (et al, termos em latim)</li>
                          <li><code>&lt;p&gt;</code> para separar cada referência</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 mt-3 sm:mt-0"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (activeTab === 'upload' && !fileName) || (activeTab === 'texto' && !texto)}
                  className={`px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center ${
                    isSubmitting || (activeTab === 'upload' && !fileName) || (activeTab === 'texto' && !texto)
                      ? 'opacity-90 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-white rounded-full opacity-25"></div>
                      </div>
                      <span>Importando...</span>
                    </div>
                  ) : (
                    <>
                      <img src="/upload-animated.svg" alt="Importar" className="h-4 w-4 mr-1" />
                      Importar Referências
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-lg border border-gray-700">
              <h3 className="text-lg sm:text-xl font-medium text-white mb-3 sm:mb-4">Formatos suportados:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-medium text-rose-400 mb-2">BibTeX</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    BibTeX é um formato de arquivo usado para descrever e processar listas de referências, 
                    predominantemente em conjunto com documentos LaTeX.
                  </p>
                  <div className="mt-2 bg-gray-900 p-2 sm:p-3 rounded text-gray-400 text-xs font-mono overflow-x-auto">
                    @book{'{'}chave{'}'},<br/>
                    &nbsp;&nbsp;author = {'{'}Sobrenome, Nome{'}'},<br/>
                    &nbsp;&nbsp;title = {'{'}Título do Livro{'}'},<br/>
                    &nbsp;&nbsp;publisher = {'{'}Editora{'}'},<br/>
                    &nbsp;&nbsp;year = {'{'}2023{'}'}<br/>
                    {'}'}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-rose-400 mb-2">RIS (Research Information Systems)</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    O formato RIS é um formato de arquivo padronizado para citações bibliográficas,
                    usado por muitos gerenciadores de referências como EndNote e Zotero.
                  </p>
                  <div className="mt-2 bg-gray-900 p-2 sm:p-3 rounded text-gray-400 text-xs font-mono overflow-x-auto">
                    TY  - BOOK<br/>
                    AU  - Sobrenome, Nome<br/>
                    TI  - Título do Livro<br/>
                    PB  - Editora<br/>
                    PY  - 2023<br/>
                    ER  -
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-rose-400 mb-2">JSON com formatação HTML</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    O formato JSON permite incluir a versão formatada da referência com tags HTML para preservar a formatação ABNT.
                  </p>
                  <div className="mt-2 bg-gray-900 p-2 sm:p-3 rounded text-gray-400 text-xs font-mono overflow-x-auto">
                    {'[\n  {\n    "author": "Sobrenome, Nome",\n    "title": "Título do livro",\n    "year": 2023,\n    "formatted": "<p>SOBRENOME, Nome. <b>Título do livro</b>. Editora, 2023.</p>"\n  }\n]'}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-rose-400 mb-2">HTML (direto)</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Você pode fornecer diretamente referências formatadas com tags HTML seguindo o padrão ABNT.
                  </p>
                  <div className="mt-2 bg-gray-900 p-2 sm:p-3 rounded text-gray-400 text-xs font-mono overflow-x-auto">
                    {'<p>ZHAO, Y. <em>et al</em>. The NLRP3 inflammasome functions as a sensor of RhoA GTPase to promote actin polymerization and cell migration. <b>Nature Immunology</b>, v. 19, n. 4, p. 293-305, 2018.</p>'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-900/30 to-gray-900/30 rounded-lg border border-rose-900/30">
              <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Precisa de ajuda?</h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Visite nossa página de ajuda para instruções detalhadas sobre como exportar referências de diferentes plataformas 
                como Google Scholar, Mendeley, Zotero e EndNote.
              </p>
              <div className="mt-3 sm:mt-4">
                <Link href="/ajuda" className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition-colors text-xs sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ver guias de importação
                </Link>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-900/30 to-gray-900/30 rounded-lg border border-rose-900/30">
              <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Exemplos de formatação ABNT:</h3>
              <div className="bg-gray-900/70 p-3 rounded-lg mt-3 text-gray-300 text-sm">
                <div dangerouslySetInnerHTML={{ __html: `
                  <p>ZHAO, Y. <em>et al</em>. The NLRP3 inflammasome functions as a sensor of RhoA GTPase to promote actin polymerization and cell migration. <b>Nature Immunology</b>, v. 19, n. 4, p. 293-305, 2018.</p>
                  <p>ZHENG, D.; LIWINSKI, T.; ELINAV, E. Inflammasome activation and regulation: toward a better understanding of complex mechanisms. <b>Cell Discovery</b>, v. 6, p. 36, 2020.</p>
                  <p>SILVA, João Carlos. <b>Implementação de algoritmos de aprendizado de máquina para detecção de fraudes</b>. Dissertação (Mestrado em Ciência da Computação) - Universidade Federal de São Paulo, São Paulo, 2022.</p>
                  <p>BRASIL. Lei nº 9.394. Estabelece as diretrizes e bases da educação nacional. Brasília: Seção 1, 1996.</p>
                `}} />
                <div className="mt-3 border-t border-gray-700 pt-3">
                  <p className="text-sm text-gray-400 mb-2">Código HTML usado:</p>
                  <pre className="text-xs text-gray-500 overflow-x-auto">
                    {`<p>SILVA, João Carlos. <b>Implementação de algoritmos de aprendizado de máquina para detecção de fraudes</b>. Dissertação (Mestrado em Ciência da Computação) - Universidade Federal de São Paulo, São Paulo, 2022.</p>`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-lg border border-gray-700 mt-4">
              <h3 className="text-lg sm:text-xl font-medium text-white mb-3 sm:mb-4">Tipos de referências suportados:</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-rose-400 mb-1 text-sm">Bibliográficas</h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Livros</li>
                    <li>• Artigos Científicos</li>
                    <li>• Revistas</li>
                    <li>• Artigos de Conferência</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-rose-400 mb-1 text-sm">Acadêmicas</h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Dissertações</li>
                    <li>• Teses</li>
                    <li>• Monografias</li>
                    <li>• Trabalhos de Conclusão</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-rose-400 mb-1 text-sm">Normativas e Legais</h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Normas Técnicas</li>
                    <li>• Leis</li>
                    <li>• Resoluções</li>
                    <li>• Portarias</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-rose-400 mb-1 text-sm">Recursos Digitais</h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Sites</li>
                    <li>• Blogs</li>
                    <li>• Redes Sociais</li>
                    <li>• Vídeos</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-rose-400 mb-1 text-sm">Jornalísticas</h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Jornais</li>
                    <li>• Revistas</li>
                    <li>• Portais de Notícias</li>
                    <li>• Entrevistas</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-rose-400 mb-1 text-sm">Outros</h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Relatórios</li>
                    <li>• Documentos Oficiais</li>
                    <li>• Manuais</li>
                    <li>• Guias</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 mt-4">
                Todos os tipos seguem as normas da ABNT para formatação de referências bibliográficas.
                Para referências não listadas acima, você pode usar a opção de formatar manualmente o HTML.
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-900/30 to-gray-900/30 rounded-lg border border-rose-900/30 mt-4">
              <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Novos campos detalhados para artigos científicos:</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3">
                Agora oferecemos campos mais detalhados para artigos científicos, permitindo uma formatação ABNT mais precisa:
              </p>
              
              <div className="bg-gray-900/70 p-3 rounded-lg text-gray-300 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-rose-400 mb-2 text-sm">Campos Detalhados:</h4>
                    <ul className="list-disc ml-5 space-y-1 text-xs">
                      <li>Subtítulo (para artigos com subtítulos)</li>
                      <li>Fascículo (além de volume e número)</li>
                      <li>Página Inicial e Página Final (alternativa ao campo Páginas)</li>
                      <li>Mês de Publicação</li>
                      <li>Notas Adicionais (ex: idioma original)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-rose-400 mb-2 text-sm">Exemplo Formatado:</h4>
                    <div className="bg-gray-800/80 p-2 rounded text-xs">
                      <div dangerouslySetInnerHTML={{ __html: `
                        <p>CHENG, L.; ZHANG, X.; LI, Y.; WANG, P.; DU, Z. <em>et al</em>. NLRP3 gene polymorphisms and expression in rheumatoid arthritis: A systematic review and meta-analysis. <b>Experimental and Therapeutic Medicine</b>, v. 22, n. 4, p. 1-9, 2021. DOI: 10.3892/etm.2021.10549. Artigo em inglês.</p>
                      `}} />
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 border-t border-gray-700 pt-3">
                  <p className="text-xs text-gray-400 mb-2">Exemplo de JSON com campos detalhados:</p>
                  <pre className="text-xs text-gray-500 overflow-x-auto">
{`{
  "tipo": "artigo",
  "titulo": "NLRP3 gene polymorphisms and expression in rheumatoid arthritis",
  "subtitulo": "A systematic review and meta-analysis",
  "autores": "Cheng, L.; Zhang, X.; Li, Y.; Wang, P.; Du, Z.",
  "ano": "2021",
  "revista": "Experimental and Therapeutic Medicine",
  "volume": "22",
  "numero": "4",
  "paginas": "1-9",
  "paginaInicial": "1",
  "paginaFinal": "9",
  "doi": "10.3892/etm.2021.10549",
  "notaAdicional": "Artigo em inglês"
}`}
                  </pre>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 mt-3">
                Disponibilizamos um <a href="/exemplos/referencias-exemplos-artigos.json" download className="text-rose-400 hover:text-rose-300 underline">arquivo de exemplo</a> com referências de artigos sobre artrite reumatoide em formato JSON.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-rose-900/80 to-gray-900/80 backdrop-blur-md py-4 sm:py-6 text-center text-gray-400 mt-8 sm:mt-12 border-t border-rose-900/30 relative z-10">
        <div className="container mx-auto px-4">
          <p className="font-medium text-sm sm:text-base">© {new Date().getFullYear()} InovAcadêmico - Tecnologia para pesquisa acadêmica</p>
          <div className="mt-2 sm:mt-3 text-xs sm:text-sm flex flex-wrap justify-center gap-3 sm:gap-6">
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
          </div>
        </div>
      </footer>
    </div>
  );
} 