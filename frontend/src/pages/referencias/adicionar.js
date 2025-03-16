/**
 * File: inovacademico/frontend/src/pages/referencias/adicionar.js
 * Página para adicionar referências manualmente
 */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdicionarReferencia() {
  const router = useRouter();
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
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (message.text) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Aqui seria feita a chamada à API
      // Por enquanto, apenas simulamos o sucesso após 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulação de sucesso
      setMessage({
        type: 'success',
        text: 'Referência adicionada com sucesso!'
      });
      
      // Limpar o formulário após sucesso
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
      });
    } catch (error) {
      // Tratamento de erro
      setMessage({
        type: 'error',
        text: 'Erro ao adicionar referência. Tente novamente.'
      });
      console.error('Erro ao adicionar referência:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componentes condicionais baseados no tipo de referência
  const renderTipoFields = () => {
    switch (formData.tipo) {
      case 'livro':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="editora" className="block text-gray-300 mb-1 font-medium">Editora*</label>
              <input
                type="text"
                id="editora"
                name="editora"
                value={formData.editora}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="local" className="block text-gray-300 mb-1 font-medium">Local de Publicação*</label>
                <input
                  type="text"
                  id="local"
                  name="local"
                  value={formData.local}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edicao" className="block text-gray-300 mb-1 font-medium">Edição</label>
                <input
                  type="text"
                  id="edicao"
                  name="edicao"
                  value={formData.edicao}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="isbn" className="block text-gray-300 mb-1 font-medium">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Ex: 978-3-16-148410-0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
          </>
        );
      
      case 'artigo':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="revista" className="block text-gray-300 mb-1 font-medium">Revista/Periódico*</label>
              <input
                type="text"
                id="revista"
                name="revista"
                value={formData.revista}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-4">
                <label htmlFor="volume" className="block text-gray-300 mb-1 font-medium">Volume</label>
                <input
                  type="text"
                  id="volume"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="numero" className="block text-gray-300 mb-1 font-medium">Número</label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="paginas" className="block text-gray-300 mb-1 font-medium">Páginas</label>
                <input
                  type="text"
                  id="paginas"
                  name="paginas"
                  value={formData.paginas}
                  onChange={handleChange}
                  placeholder="Ex: 45-67"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="doi" className="block text-gray-300 mb-1 font-medium">DOI</label>
              <input
                type="text"
                id="doi"
                name="doi"
                value={formData.doi}
                onChange={handleChange}
                placeholder="Ex: 10.1000/xyz123"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
          </>
        );
        
      case 'site':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="url" className="block text-gray-300 mb-1 font-medium">URL*</label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dataAcesso" className="block text-gray-300 mb-1 font-medium">Data de Acesso*</label>
              <input
                type="date"
                id="dataAcesso"
                name="dataAcesso"
                value={formData.dataAcesso}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="instituicao" className="block text-gray-300 mb-1 font-medium">Instituição/Organização</label>
              <input
                type="text"
                id="instituicao"
                name="instituicao"
                value={formData.instituicao}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
          </>
        );
        
      case 'conferencia':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="evento" className="block text-gray-300 mb-1 font-medium">Nome do Evento*</label>
              <input
                type="text"
                id="evento"
                name="evento"
                value={formData.evento}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="local" className="block text-gray-300 mb-1 font-medium">Local*</label>
                <input
                  type="text"
                  id="local"
                  name="local"
                  value={formData.local}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="paginas" className="block text-gray-300 mb-1 font-medium">Páginas</label>
                <input
                  type="text"
                  id="paginas"
                  name="paginas"
                  value={formData.paginas}
                  onChange={handleChange}
                  placeholder="Ex: 45-67"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="doi" className="block text-gray-300 mb-1 font-medium">DOI</label>
              <input
                type="text"
                id="doi"
                name="doi"
                value={formData.doi}
                onChange={handleChange}
                placeholder="Ex: 10.1000/xyz123"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
          </>
        );
        
      default:
        return null;
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
        <title>Adicionar Referência - InovAcadêmico</title>
        <meta name="description" content="Adicione referências bibliográficas manualmente no InovAcadêmico" />
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
              <img src="/close-animated.svg" alt="Fechar" className="h-4 w-4 text-rose-200" />
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
              Adicionar Referência
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-orange-500 to-transparent rounded-full"></div>
            </h2>
            <Link href="/referencias/importar" className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Prefere importar?
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

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="bg-gray-900/50 rounded-lg p-4 sm:p-6 border border-gray-700">
              <div className="mb-4">
                <label htmlFor="tipo" className="block text-gray-300 mb-1 font-medium">Tipo de Referência*</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                  required
                >
                  <option value="livro">Livro</option>
                  <option value="artigo">Artigo Científico</option>
                  <option value="site">Site/Página Web</option>
                  <option value="conferencia">Artigo de Conferência</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="titulo" className="block text-gray-300 mb-1 font-medium">Título*</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="autores" className="block text-gray-300 mb-1 font-medium flex flex-col sm:flex-row sm:items-center">
                  Autores*
                  <span className="text-xs mt-1 sm:mt-0 sm:ml-2 text-gray-400">(Separe múltiplos autores com ponto e vírgula)</span>
                </label>
                <input
                  type="text"
                  id="autores"
                  name="autores"
                  value={formData.autores}
                  onChange={handleChange}
                  placeholder="Ex: Silva, João; Oliveira, Maria"
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="ano" className="block text-gray-300 mb-1 font-medium">Ano de Publicação*</label>
                <input
                  type="text"
                  id="ano"
                  name="ano"
                  value={formData.ano}
                  onChange={handleChange}
                  placeholder="Ex: 2023"
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                  required
                />
              </div>

              {/* Campos específicos por tipo de referência */}
              {renderTipoFields()}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
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
          </form>

          <div className="mt-8 sm:mt-10 p-4 sm:p-5 bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-lg border border-gray-700">
            <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Dicas para adicionar referências:</h3>
            <ul className="text-gray-300 space-y-1 sm:space-y-2 list-disc pl-5 text-sm sm:text-base">
              <li>Preencha o máximo de campos possível para garantir uma referência completa</li>
              <li>Para livros, o local de publicação geralmente refere-se à cidade onde a editora está localizada</li>
              <li>Para artigos científicos, fornecer o DOI facilita a localização precisa do documento</li>
              <li>Para sites, sempre inclua a data de acesso, pois o conteúdo pode mudar com o tempo</li>
              <li>Se preferir importar várias referências de uma vez, utilize a opção "Importar Referências"</li>
            </ul>
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