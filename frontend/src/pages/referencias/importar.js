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

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(bib|json|ris|txt)$/i)) {
      setFileError('Formato de arquivo não suportado. Por favor, envie um arquivo BibTeX, RIS, JSON ou TXT.');
      e.target.value = '';
      setFileName('');
      return;
    }

    // Detectar formato com base na extensão
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'bib') setFormato('bibtex');
    else if (extension === 'ris') setFormato('ris');
    else if (extension === 'json') setFormato('json');
    
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
      // Aqui seria feita a chamada à API para processar o arquivo ou texto
      // Por enquanto, apenas simulamos o sucesso após 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulação de sucesso
      setMessage({
        type: 'success',
        text: activeTab === 'upload' 
          ? `${fileName} importado com sucesso! 12 referências adicionadas.` 
          : `Referências importadas com sucesso! 8 referências adicionadas.`
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
      setMessage({
        type: 'error',
        text: 'Erro ao importar referências. Verifique o formato e tente novamente.'
      });
      console.error('Erro ao importar referências:', error);
    } finally {
      setIsSubmitting(false);
    }
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
                <span className="font-medium">Você pode usar o chatGPT ou outra, mas nenhuma é 100% precisa</span>, por isso estamos convidando você a ajudar a gente a melhorar cada vez mais. Cadastre suas referências em nossa plataforma e usaremos elas como base para aprimorar o nosso modelo.
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
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
                    </div>
                  </div>

                  <div className="mb-6">
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept=".bib,.ris,.json,.txt" 
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
                          <div className="text-gray-500 text-xs sm:text-sm">Suportamos BibTeX, RIS, JSON e TXT (máx. 5MB)</div>
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
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
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="texto" className="block text-gray-300 mb-2 font-medium flex flex-col sm:flex-row sm:items-center">
                      <span>Cole suas referências abaixo</span>
                      <span className="text-xs mt-1 sm:mt-0 sm:ml-2 text-gray-400">(máximo 5000 caracteres)</span>
                    </label>
                    <textarea
                      id="texto"
                      name="texto"
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      rows={8}
                      maxLength={5000}
                      placeholder={formato === 'bibtex' 
                        ? '@article{key2023,\n  author = {Sobrenome, Nome},\n  title = {Título do artigo},\n  journal = {Nome da revista},\n  year = {2023}\n}'
                        : formato === 'json'
                          ? '[\n  {\n    "author": "Sobrenome, Nome",\n    "title": "Título do livro",\n    "year": 2023\n  }\n]'
                          : formato === 'ris'
                            ? 'TY  - JOUR\nAU  - Sobrenome, Nome\nTI  - Título do artigo\nJO  - Nome da revista\nPY  - 2023\nER  -'
                            : 'Cole suas referências aqui (uma por linha)'
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white font-mono text-xs sm:text-sm"
                      required
                    />
                    <div className="mt-1 text-right text-xs text-gray-500">
                      {texto.length}/5000 caracteres
                    </div>
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