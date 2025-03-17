/**
 * File: inovacademico/frontend/src/pages/referencias/adicionar.js
 * Página para adicionar referências manualmente
 */
import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Componentes modularizados
import Header from './components/Header';
import Footer from './components/Footer';
import InfoBanner from './components/InfoBanner';
import CustomAlert from './components/CustomAlert';
import InlineAlert from './components/InlineAlert';
import ReferenceForm from './components/ReferenceForm';
import BarraFormatacao from './components/BarraFormatacao';
import ModalAjuda from './components/ModalAjuda';

const AdicionarReferencia = () => {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [showHelp, setShowHelp] = useState(false);
  const [formRef, setFormRef] = useState(null);

  // Mostrar alerta quando houver uma mensagem
  React.useEffect(() => {
    if (message) {
      setShowAlert(true);
      // Esconder alerta após 5 segundos
      const timer = setTimeout(() => {
        setShowAlert(false);
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Função para mostrar mensagem de sucesso ou erro
  const handleMessage = (msg, type = 'success') => {
    if (msg) {
      setMessage(msg);
      setAlertType(type);
    }
  };

  // Função para abrir modal de ajuda
  const handleOpenHelp = () => {
    setShowHelp(true);
  };

  // Função para fechar alert
  const handleCloseAlert = () => {
    setShowAlert(false);
    setMessage(null);
  };

        return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Adicionar Referência - Sistema Acadêmico</title>
        <meta name="description" content="Adicione uma nova referência bibliográfica" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Modal de Ajuda */}
      <ModalAjuda show={showHelp} setShow={setShowHelp} />

      {/* Alerta para mensagens */}
      {showAlert && message && (
        <CustomAlert 
          message={message} 
          type={alertType} 
          onClose={handleCloseAlert} 
        />
      )}

      {/* Banner informativo */}
      <InfoBanner 
        title="Adicionar Nova Referência" 
        description="Preencha o formulário abaixo para adicionar uma nova referência bibliográfica."
      />

      {/* Cabeçalho */}
      <Header />

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-rose-500">Adicionar Nova Referência</h1>
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

        {/* Barra de formatação */}
          <BarraFormatacao formRef={formRef} onHelp={handleOpenHelp} />
          
          {/* Formulário de referência */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
            <ReferenceForm 
              onSuccess={(resultado) => {
                alert('Referência salva com sucesso!');
                // Redirecionamento é opcional agora
                if (confirm('Deseja adicionar outra referência?')) {
                  window.location.reload();
                } else {
                  router.push('/referencias');
                }
              }}
              setFormRef={setFormRef}
            />
          </div>
        </div>

        {/* Informações sobre tipos de referências */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-medium text-white mb-4">Tipos de Referências Suportados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-rose-400 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-medium">Livro</span>
              </div>
              <p className="text-gray-300 text-sm">
                Obras literárias, livros técnicos, manuais, enciclopédias e outros materiais publicados como livro.
              </p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-rose-400 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span className="font-medium">Artigo Científico</span>
            </div>
              <p className="text-gray-300 text-sm">
                Artigos publicados em periódicos acadêmicos, revistas científicas e journals.
              </p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-rose-400 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="font-medium">Site / Página Web</span>
              </div>
              <p className="text-gray-300 text-sm">
                Referências a conteúdos publicados na internet, como sites, blogs, páginas institucionais e artigos online.
              </p>
              </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-rose-400 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Artigo de Conferência</span>
              </div>
              <p className="text-gray-300 text-sm">
                Trabalhos apresentados em conferências, congressos, simpósios e eventos acadêmicos.
              </p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-rose-400 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <span className="font-medium">Lei / Legislação</span>
            </div>
              <p className="text-gray-300 text-sm">
                Documentos legais como leis, decretos, portarias, resoluções e normativas.
              </p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-rose-400 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">Dissertação / Tese</span>
              </div>
              <p className="text-gray-300 text-sm">
                Trabalhos acadêmicos como dissertações de mestrado, teses de doutorado e trabalhos de conclusão de curso.
              </p>
            </div>
          </div>
                </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default AdicionarReferencia; 