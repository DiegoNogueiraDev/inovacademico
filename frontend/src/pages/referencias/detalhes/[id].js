import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InfoBanner from '../components/InfoBanner';
import { buscarReferenciaPorId, removerReferencia } from '../../../services/referencias';

const DetalhesReferencia = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [referencia, setReferencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    // Só realizar a busca quando o id estiver disponível
    if (!id) return;

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
  }, [id]);

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
    if (!id || !confirm('Tem certeza que deseja excluir esta referência? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      setRemovendo(true);
      const resultado = await removerReferencia(id);
      
      if (resultado.success) {
        alert('Referência excluída com sucesso!');
        router.push('/referencias');
      } else {
        alert(`Erro ao excluir referência: ${resultado.message}`);
      }
    } catch (error) {
      console.error('Erro ao excluir referência:', error);
      alert(`Erro: ${error.message || 'Falha ao excluir referência'}`);
    } finally {
      setRemovendo(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Head>
        <title>{referencia ? `${referencia.title} - Detalhes` : 'Carregando...'} - Sistema Acadêmico</title>
        <meta name="description" content="Detalhes da referência bibliográfica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Banner informativo */}
      <InfoBanner 
        title="Detalhes da Referência" 
        description="Visualize todos os detalhes da referência bibliográfica selecionada."
      />

      {/* Cabeçalho */}
      <Header />

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-rose-500">Detalhes da Referência</h1>
            <Link 
              href="/referencias"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar para Listagem de Referências
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
              <span className="ml-3 text-gray-300">Carregando detalhes da referência...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 text-white p-4 rounded-lg mb-6">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Atualizar e tentar novamente
                </button>
                <Link 
                  href="/referencias"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar para lista de referências
                </Link>
              </div>
            </div>
          ) : referencia ? (
            <div className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
              {/* Cabeçalho da referência */}
              <div className="bg-gray-800/80 p-4">
                <div className="text-sm text-rose-400 mb-1">{formatarTipo(referencia.type)}</div>
                <h2 className="text-xl font-semibold text-white mb-2" dangerouslySetInnerHTML={{__html: referencia.title}}></h2>
                <p className="text-gray-300" dangerouslySetInnerHTML={{__html: referencia.authors}}></p>
              </div>
              
              {/* Dados da referência */}
              <div className="p-4">
                {referencia.formattedReference && (
                  <div className="bg-gray-800/50 p-4 rounded-lg mb-6 border border-gray-700">
                    <h3 className="text-lg font-medium mb-3 text-rose-400">Referência Formatada</h3>
                    <p className="text-white leading-relaxed" dangerouslySetInnerHTML={{__html: referencia.formattedReference}}></p>
                  </div>
                )}
                
                <h3 className="text-lg font-medium mb-3 text-white">Informações Completas</h3>
                <div className="space-y-1">
                  {Object.entries(referencia).map(([chave, valor], index) => {
                    // Skip internal fields and empty values
                    if (chave.startsWith('_') || chave === 'type' || chave === 'formattedReference' || !valor) {
                      return null;
                    }
                    return <React.Fragment key={index}>{formatarInformacao(chave, valor)}</React.Fragment>;
                  })}
                </div>
              </div>
              
              {/* Ações para esta referência */}
              <div className="bg-gray-800/80 p-4 flex flex-wrap justify-end gap-3">
                <Link 
                  href="/referencias"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar para lista
                </Link>
                
                <Link 
                  href={`/referencias/editar/${id}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
                  title="Editar os dados desta referência"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Referência
                </Link>
                
                <button 
                  className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center ${removendo ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={handleExcluir}
                  disabled={removendo}
                  title="Excluir esta referência permanentemente"
                >
                  {removendo ? (
                    <>
                      <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Excluindo referência...
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
          ) : (
            <div className="bg-red-900/30 border border-red-800 text-white p-6 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium mb-3">Referência não encontrada</h3>
              <p className="text-gray-300 mb-6">Não foi possível encontrar a referência solicitada. Ela pode ter sido excluída ou o ID informado é inválido.</p>
              <Link 
                href="/referencias"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para lista de referências
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default DetalhesReferencia; 