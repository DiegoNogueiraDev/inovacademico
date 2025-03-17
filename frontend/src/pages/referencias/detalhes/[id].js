import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InfoBanner from '../components/InfoBanner';
import ModalAlert from '../components/ModalAlert';
import { buscarReferenciaPorId, removerReferencia } from '../../../services/referencias';

const DetalhesReferencia = () => {
  const router = useRouter();
  const { id, modo } = router.query;
  
  const [referencia, setReferencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removendo, setRemovendo] = useState(false);
  const [modoView, setModoView] = useState('visualizar'); // visualizar | editar | citar
  
  // Modal para substituir alerts
  const [modalAlert, setModalAlert] = useState({ 
    isOpen: false,
    message: '',
    type: 'info',
    onConfirm: null
  });

  useEffect(() => {
    // Só realizar a busca quando o id estiver disponível
    if (!id) return;

    // Definir o modo de visualização baseado no parâmetro da URL
    if (modo === 'editar') {
      setModoView('editar');
    } else if (modo === 'citar') {
      setModoView('citar');
    } else {
      setModoView('visualizar');
    }

    const carregarReferencia = async () => {
      try {
        setLoading(true);
        const resultado = await buscarReferenciaPorId(id);
        
        if (resultado.success) {
          setReferencia(resultado.data);
        } else {
          setError(resultado.message || 'Erro ao carregar detalhes da referência');
        }
      } catch (error) {
        console.error('Erro ao buscar referência:', error);
        setError('Falha ao conectar com o servidor. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    carregarReferencia();
  }, [id, modo]);

  // Função para mostrar modal no lugar de alert
  const showModal = (message, type = 'info', onConfirm = null) => {
    setModalAlert({
      isOpen: true,
      message,
      type,
      onConfirm
    });
  };
  
  // Fechar modal
  const closeModal = () => {
    setModalAlert(prev => {
      if (prev.onConfirm) {
        prev.onConfirm();
      }
      return {
        ...prev,
        isOpen: false,
        onConfirm: null
      };
    });
  };

  // Formatar informações com base no tipo de referência
  const formatarInformacao = (chave, valor) => {
    if (!valor) return null;
    
    // Mapeamento de chaves para labels mais amigáveis
    const labels = {
      title: 'Título',
      authors: 'Autor(es)',
      year: 'Ano',
      publisher: 'Editora',
      location: 'Local',
      edition: 'Edição',
      volume: 'Volume',
      pages: 'Páginas',
      doi: 'DOI',
      url: 'URL',
      accessDate: 'Data de Acesso',
      journal: 'Periódico',
      issue: 'Número',
      institution: 'Instituição',
      event: 'Evento',
      isbn: 'ISBN',
      issn: 'ISSN',
      subtitle: 'Subtítulo',
      language: 'Idioma',
      keywords: 'Palavras-chave',
      notes: 'Notas',
      formattedReference: 'Referência Formatada'
    };
    
    return (
      <div className="grid grid-cols-3 border-b border-gray-700 py-3 px-1">
        <div className="col-span-1 text-gray-400 font-medium">{labels[chave] || chave}</div>
        <div className="col-span-2 text-white" dangerouslySetInnerHTML={{__html: valor}}></div>
      </div>
    );
  };

  // Formatar tipo de referência
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

  // Função para excluir a referência
  const handleExcluir = async () => {
    showModal(
      'Tem certeza que deseja excluir esta referência? Esta ação não pode ser desfeita.',
      'warning',
      async () => {
        try {
          setRemovendo(true);
          const resultado = await removerReferencia(id);
          
          if (resultado.success) {
            showModal('Referência excluída com sucesso!', 'success', () => {
              router.push('/referencias');
            });
          } else {
            showModal(`Erro ao excluir referência: ${resultado.message}`, 'error');
          }
        } catch (error) {
          console.error('Erro ao excluir referência:', error);
          showModal(`Erro: ${error.message || 'Falha ao excluir referência'}`, 'error');
        } finally {
          setRemovendo(false);
        }
      }
    );
  };

  // Função para copiar texto para a área de transferência
  const copiarCitacao = (texto) => {
    navigator.clipboard.writeText(texto)
      .then(() => {
        showModal('Citação copiada para a área de transferência!', 'success');
      })
      .catch(err => {
        console.error('Erro ao copiar texto: ', err);
        showModal('Não foi possível copiar o texto. Tente novamente.', 'error');
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Head>
        <title>
          {modoView === 'editar' && 'Editar Referência - '}
          {modoView === 'citar' && 'Gerar Citação - '}
          {referencia ? `${referencia.title}` : 'Carregando...'} - Sistema Acadêmico
        </title>
        <meta name="description" content="Detalhes da referência bibliográfica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Modal para substituir alert() */}
      <ModalAlert 
        isOpen={modalAlert.isOpen}
        onClose={closeModal}
        message={modalAlert.message}
        type={modalAlert.type}
      />

      {/* Banner informativo */}
      <InfoBanner 
        title={modoView === 'editar' ? 'Editar Referência' : 
               modoView === 'citar' ? 'Gerar Citação' : 
               'Detalhes da Referência'} 
        description={modoView === 'editar' ? 'Edite as informações da referência bibliográfica.' : 
                    modoView === 'citar' ? 'Gere citações para esta referência em diferentes formatos.' : 
                    'Visualize todos os detalhes da referência bibliográfica selecionada.'}
      />

      {/* Cabeçalho */}
      <Header />

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-rose-500">
              {modoView === 'editar' && 'Editar Referência'}
              {modoView === 'citar' && 'Gerar Citação'}
              {modoView === 'visualizar' && 'Detalhes da Referência'}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/referencias"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para Listagem
              </Link>
              
              {/* Botões adicionais com base no modo */}
              {modoView === 'visualizar' && (
                <>
                  <Link 
                    href={`/referencias/detalhes/${id}?modo=editar`}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Editar Referência
                  </Link>
                  <Link 
                    href={`/referencias/detalhes/${id}?modo=citar`}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Gerar Citação
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Exibir conteúdo com base no modo */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
              <span className="ml-3 text-gray-300">Carregando detalhes...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 text-white p-4 rounded-lg mb-6">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button 
                  onClick={() => router.reload()}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Tentar novamente
                </button>
                <Link
                  href="/referencias"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar para a lista
                </Link>
              </div>
            </div>
          ) : !referencia ? (
            <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3 text-gray-300">Referência não encontrada</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                A referência que você está procurando não foi encontrada ou pode ter sido removida.
              </p>
              <Link 
                href="/referencias" 
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para Lista de Referências
              </Link>
            </div>
          ) : (
            <>
              {/* MODO VISUALIZAR */}
              {modoView === 'visualizar' && (
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                  {/* Tipo de referência */}
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-rose-600/20 text-rose-400 rounded-full text-sm font-medium mb-2">
                      {formatarTipo(referencia.type)}
                    </span>
                    <h2 className="text-2xl font-bold text-white" dangerouslySetInnerHTML={{__html: referencia.title}}></h2>
                    <p className="text-gray-400 mt-2" dangerouslySetInnerHTML={{__html: referencia.authors}}></p>
                  </div>
                  
                  {/* Informações da referência */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(referencia)
                      .filter(([chave]) => !['_id', '__v'].includes(chave)) // Ignorar campos internos
                      .map(([chave, valor]) => formatarInformacao(chave, valor))
                      .filter(Boolean) // Remover itens nulos
                    }
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      onClick={handleExcluir}
                      disabled={removendo}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 text-white rounded-lg transition-colors duration-200 flex items-center"
                    >
                      {removendo ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          Excluindo...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Excluir Referência
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* MODO EDITAR */}
              {modoView === 'editar' && (
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                  <div className="mb-6 text-center">
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6 inline-block">
                      <p className="text-yellow-300 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Funcionalidade de edição em desenvolvimento
                      </p>
                    </div>
                    <p className="text-gray-300 mb-4">
                      A função de edição estará disponível em breve! Por enquanto, você pode visualizar todos os detalhes da referência abaixo.
                    </p>
                    <Link 
                      href={`/referencias/detalhes/${id}`}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Voltar para Visualização
                    </Link>
                  </div>
                </div>
              )}

              {/* MODO CITAR */}
              {modoView === 'citar' && (
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                  <div className="mb-6 text-center">
                    <h2 className="text-xl font-bold text-white mb-4">Citações para "{referencia.title}"</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      {/* ABNT */}
                      <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-medium text-rose-400 mb-3">Formato ABNT</h3>
                        <div className="bg-gray-900 p-4 rounded border border-gray-700 mb-4">
                          <p className="text-gray-300 text-sm">
                            {referencia.authors && referencia.authors.toUpperCase()}. <strong>{referencia.title}</strong>.
                            {referencia.publisher && ` ${referencia.publisher}`}
                            {referencia.year && `, ${referencia.year}`}.
                            {referencia.pages && ` ${referencia.pages}p.`}
                          </p>
                        </div>
                        <button 
                          onClick={() => copiarCitacao(`${referencia.authors?.toUpperCase() || ''}. ${referencia.title}. ${referencia.publisher || ''}${referencia.year ? `, ${referencia.year}` : ''}.${referencia.pages ? ` ${referencia.pages}p.` : ''}`)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors duration-200 flex items-center mx-auto"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Copiar citação
                        </button>
                      </div>
                      
                      {/* APA */}
                      <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-medium text-rose-400 mb-3">Formato APA</h3>
                        <div className="bg-gray-900 p-4 rounded border border-gray-700 mb-4">
                          <p className="text-gray-300 text-sm">
                            {referencia.authors && `${referencia.authors}`} 
                            {referencia.year && ` (${referencia.year}).`} 
                            <em>{referencia.title}</em>.
                            {referencia.publisher && ` ${referencia.publisher}.`}
                          </p>
                        </div>
                        <button 
                          onClick={() => copiarCitacao(`${referencia.authors || ''} ${referencia.year ? `(${referencia.year})` : ''}. ${referencia.title}. ${referencia.publisher ? `${referencia.publisher}.` : ''}`)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors duration-200 flex items-center mx-auto"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Copiar citação
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mt-8">
                      <p className="text-yellow-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Mais formatos de citação estarão disponíveis em breve!
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <Link 
                        href={`/referencias/detalhes/${id}`}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Voltar para Visualização
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default DetalhesReferencia; 