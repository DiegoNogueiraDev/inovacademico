/**
 * File: inovacademico/frontend/src/pages/_app.js
 * Arquivo principal de configuração da aplicação
 */
import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
          <motion.div 
            key="loader" 
            className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-rose-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-orange-500 animate-spin-slow"></div>
              <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-rose-400 animate-spin-reverse"></div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Component {...pageProps} />
            
            {/* Background animation particles persistentes em toda a aplicação */}
            <div className="fixed -z-10 inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute w-1 h-1 bg-rose-500 rounded-full animate-floating" style={{ top: '15%', left: '10%', animationDelay: '0s' }}></div>
              <div className="absolute w-1 h-1 bg-orange-500 rounded-full animate-floating" style={{ top: '25%', left: '20%', animationDelay: '0.5s' }}></div>
              <div className="absolute w-1 h-1 bg-rose-400 rounded-full animate-floating" style={{ top: '35%', left: '80%', animationDelay: '1s' }}></div>
              <div className="absolute w-1 h-1 bg-orange-400 rounded-full animate-floating" style={{ top: '65%', left: '75%', animationDelay: '1.5s' }}></div>
              <div className="absolute w-1 h-1 bg-rose-500 rounded-full animate-floating" style={{ top: '85%', left: '15%', animationDelay: '2s' }}></div>
              <div className="absolute w-1 h-1 bg-orange-500 rounded-full animate-floating" style={{ top: '45%', left: '30%', animationDelay: '2.5s' }}></div>
              <div className="absolute w-1 h-1 bg-rose-400 rounded-full animate-floating" style={{ top: '55%', left: '65%', animationDelay: '3s' }}></div>
              <div className="absolute w-1 h-1 bg-orange-400 rounded-full animate-floating" style={{ top: '75%', left: '45%', animationDelay: '3.5s' }}></div>
            </div>
          </motion.div>
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

        @keyframes floating {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-15px) translateX(5px);
            opacity: 1;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.5;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }

        .animate-floating {
          animation: floating 8s ease-in-out infinite;
        }

        /* Personalização da barra de rolagem */
        .custom-scrollbar::-webkit-scrollbar,
        body::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track,
        body::-webkit-scrollbar-track {
          background: #1e293b;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb,
        body::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover,
        body::-webkit-scrollbar-thumb:hover {
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