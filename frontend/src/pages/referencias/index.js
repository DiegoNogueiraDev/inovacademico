import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from './components/Header';
import Footer from './components/Footer';
import InfoBanner from './components/InfoBanner';
import { buscarReferencias } from '../../services/referencias';

const Referencias = () => {
  const router = useRouter();
  const [referencias, setReferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Efeito para debounce da pesquisa
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Resetar para primeira página ao pesquisar
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const carregarReferencias = async () => {
      try {
        setLoading(true);
        // Construir objeto de filtros para a API
        const filtros = {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchTerm
        };
        
        const resultado = await buscarReferencias(filtros);
        
        if (resultado.success) {
          setReferencias(resultado.data);
          
          // Configurar paginação
          if (resultado.pagination) {
            setTotalPages(resultado.pagination.pages);
            setTotalItems(resultado.pagination.total);
          }
        } else {
          setError(resultado.message || 'Erro ao carregar referências');
        }
      } catch (error) {
        console.error('Erro ao buscar referências:', error);
        setError('Falha ao conectar com o servidor. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    carregarReferencias();
  }, [currentPage, itemsPerPage, debouncedSearchTerm]);

  // Função para formatar exibição de tipo
  const formatarTipo = (tipo) => {
    const tipos = {
      'livro': 'Livro',
      'artigo': 'Artigo Científico',
      'revista': 'Revista/Periódico',
      'site': 'Site/Página Web',
      'conferencia': 'Artigo de Conferência',
      'lei': 'Lei/Legislação',
      'dissertacao': 'Dissertação/Tese'
    };
    
    return tipos[tipo] || tipo;
  };

  // Função para formatar informações adicionais baseado no tipo
  const formatarInfoAdicional = (referencia) => {
    if (!referencia) return '';
    
    switch (referencia.type) {
      case 'livro':
        return `${referencia.edition ? referencia.edition + 'ª Edição, ' : ''}${referencia.publisher || ''}`;
      case 'artigo':
      case 'revista':
        return referencia.journal || '';
      case 'site':
        return `Acesso em: ${referencia.accessDate || 'data não informada'}`;
      case 'conferencia':
        return referencia.event || '';
      case 'dissertacao':
        return referencia.institution || '';
      default:
        return '';
    }
  };

  // Renderizar controles de paginação
  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      // Mostrar todas as páginas se forem poucas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Lógica para mostrar páginas relevantes com elipses
      if (currentPage <= 3) {
        // Próximo ao início
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Próximo ao fim
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // No meio
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }

    return (
      <div className="flex items-center justify-between mt-6 px-2">
        <div className="text-sm text-gray-400">
          Mostrando <span className="font-medium text-gray-300">{referencias.length}</span> de <span className="font-medium text-gray-300">{totalItems}</span> referências
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`rounded-md p-2 ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          {pageNumbers.map((page, index) => 
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? 'bg-rose-700 text-white font-medium'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            )
          )}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`rounded-md p-2 ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Referências Bibliográficas - Sistema Acadêmico</title>
        <meta name="description" content="Gerencie suas referências bibliográficas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Banner informativo */}
      <InfoBanner 
        title="Gerenciamento de Referências" 
        description="Organize e formate suas referências bibliográficas conforme as normas acadêmicas."
      />

      {/* Cabeçalho */}
      <Header />

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-rose-500">Minhas Referências</h1>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/referencias/adicionar" 
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Adicionar Nova Referência
              </Link>
              <Link 
                href="/referencias/importar" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Importar Referências
                    </Link>
            </div>
          </div>
          
          {/* Barra de pesquisa */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por título, autor..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-600"
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
              <span className="ml-3 text-gray-300">Carregando referências...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 text-white p-4 rounded-lg mb-6">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar e tentar novamente
              </button>
            </div>
          ) : referencias.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3 text-gray-300">
                {debouncedSearchTerm
                  ? `Nenhuma referência encontrada para "${debouncedSearchTerm}"`
                  : "Nenhuma referência encontrada"}
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {debouncedSearchTerm
                  ? "Tente pesquisar usando termos diferentes ou verifique se escreveu corretamente."
                  : "Você ainda não adicionou nenhuma referência bibliográfica. Comece adicionando sua primeira referência."}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {!debouncedSearchTerm && (
                  <>
                    <Link 
                      href="/referencias/adicionar" 
                      className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Adicionar Primeira Referência
                    </Link>
                    <Link 
                      href="/referencias/importar" 
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      Importar Referências
                    </Link>
                  </>
                )}
                {debouncedSearchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpar Pesquisa
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                {referencias.map((referencia) => (
                  <div 
                    key={referencia._id} 
                    className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-rose-500/30 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex-grow">
                        <div className="text-xs text-rose-400 mb-1">
                          {formatarTipo(referencia.type)}
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1" dangerouslySetInnerHTML={{__html: referencia.title}}></h3>
                        <p className="text-gray-400 text-sm" dangerouslySetInnerHTML={{__html: referencia.authors}}></p>
                        <p className="text-gray-500 text-xs mt-1">
                          {referencia.year && `${referencia.year} • `}
                          {referencia.journal && `${referencia.journal} • `}
                          {referencia.publisher && `${referencia.publisher}`}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link 
                          href={`/referencias/detalhes/${referencia._id}`}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200 whitespace-nowrap flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Ver Detalhes
                        </Link>
                        <Link 
                          href={`/referencias/detalhes/${referencia._id}?modo=editar`}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors duration-200 whitespace-nowrap flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Editar
                        </Link>
                        <Link 
                          href={`/referencias/detalhes/${referencia._id}?modo=citar`}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors duration-200 whitespace-nowrap flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          Citar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Controles de paginação */}
              {renderPaginationControls()}
            </>
          )}
        </div>
        
        {/* Informações adicionais sobre referências */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-medium text-white mb-4">Sobre Referências Bibliográficas</h2>
          <p className="text-gray-300 mb-4">
            Referências bibliográficas são essenciais para trabalhos acadêmicos, reconhecendo as fontes utilizadas e evitando o plágio.
            Utilize esta ferramenta para gerenciar suas referências de forma organizada.
          </p>
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-rose-400 mb-2">Dicas para gerenciar referências:</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Mantenha todas as informações completas para cada referência</li>
              <li>Organize suas referências por tipo (livros, artigos, sites, etc.)</li>
              <li>Verifique se todos os campos obrigatórios estão preenchidos</li>
              <li>Utilize os formatos de texto (negrito, itálico) conforme as normas acadêmicas</li>
            </ul>
          </div>
        </div>
        
        {/* Próximas funcionalidades */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-rose-500 mb-6">Próximas Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700 hover:border-rose-500/30 transition-all duration-300">
              <div className="mb-3 text-rose-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Gerador de Citações</h3>
              <p className="text-gray-400 text-sm">
                Gere citações automáticas em diferentes formatos (ABNT, APA, Vancouver, MLA, entre outros).
              </p>
              <div className="mt-3 inline-block px-3 py-1 bg-gray-800 rounded-full text-xs text-yellow-400 font-medium">
                Em desenvolvimento
              </div>
            </div>
            
            <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700 hover:border-rose-500/30 transition-all duration-300">
              <div className="mb-3 text-rose-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Exportação em Massa</h3>
              <p className="text-gray-400 text-sm">
                Exporte suas referências em diversos formatos como BibTeX, RIS, JSON ou CSV para uso em outros sistemas.
              </p>
              <div className="mt-3 inline-block px-3 py-1 bg-gray-800 rounded-full text-xs text-yellow-400 font-medium">
                Em desenvolvimento
              </div>
            </div>
            
            <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700 hover:border-rose-500/30 transition-all duration-300">
              <div className="mb-3 text-rose-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Verificador de Plágio</h3>
              <p className="text-gray-400 text-sm">
                Verifique a originalidade do seu trabalho com nossa ferramenta de detecção de plágio integrada.
              </p>
              <div className="mt-3 inline-block px-3 py-1 bg-gray-800 rounded-full text-xs text-yellow-400 font-medium">
                Em desenvolvimento
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Referencias; 