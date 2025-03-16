/**
 * File: inovacademico/frontend/src/pages/_app.js
 * Arquivo principal de configuração da aplicação
 */
import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular um tempo de carregamento mínimo para a animação
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>InovAcadêmico - Correção de Bibliografias</title>
        <meta name="description" content="Ferramenta inteligente para correção de bibliografias acadêmicas utilizando IA" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preconnect para otimização */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* A importação da fonte está agora no _document.js */}
      </Head>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div key="loader" className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-rose-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-orange-500 animate-spin-slow"></div>
              <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-rose-400 animate-spin-reverse"></div>
            </div>
          </div>
        ) : (
          <Component {...pageProps} key="app" />
        )}
      </AnimatePresence>

      {/* Definição de variáveis CSS globais para o tema */}
      <style jsx global>{`
        :root {
          --primary-color: #f43f5e;
          --secondary-color: #fb923c;
          --accent-color: #ec4899;
          --background-color: #0f172a;
          --card-background: #1e293b;
          --text-color: #f8fafc;
          --text-secondary: #94a3b8;
        }

        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          to {
            transform: rotate(-360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }

        /* Personalização da barra de rolagem */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        /* Utilitários de truncamento de texto */
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </>
  );
}

export default MyApp;