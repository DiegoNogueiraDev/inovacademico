/**
 * File: inovacademico/frontend/src/components/StatsCounter.js
 * Component for displaying statistics with animated counters and charts
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import apiService from '../services/apiService';
import Link from 'next/link';
import { createPortal } from 'react-dom';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Componente de Portal seguro para Next.js
const ClientOnlyPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    ref.current = document.querySelector('#portal-root');
    // Se o portal-root não existir, crie-o
    if (!ref.current) {
      const div = document.createElement('div');
      div.id = 'portal-root';
      document.body.appendChild(div);
      ref.current = div;
    }
    setMounted(true);
    
    // Limpar ao desmontar
    return () => {
      if (ref.current && ref.current.parentElement && ref.current.childNodes.length === 0) {
        document.body.removeChild(ref.current);
      }
    };
  }, []);

  return mounted && ref.current ? createPortal(children, ref.current) : null;
};

// Componente do Drawer de Estatísticas
const StatsDrawer = ({ isOpen, onClose, stats, isLoading, showChart, setShowChart }) => {
  // Calcular porcentagens para o gráfico
  const calculatePercentage = (value) => {
    if (!stats.totalCorrections) return 0;
    return Math.round((value / stats.totalCorrections) * 100);
  };

  // Dados para o gráfico
  const chartData = {
    labels: ['ABNT', 'APA', 'Vancouver', 'MLA'],
    datasets: [
      {
        data: [
          stats.abntCorrections,
          stats.apaCorrections,
          stats.vancouverCorrections,
          stats.mlaCorrections
        ],
        backgroundColor: [
          'rgba(225, 29, 72, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)'
        ],
        borderColor: [
          'rgba(225, 29, 72, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(251, 146, 60, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opções do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10
          },
          boxWidth: 12,
          padding: 10
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        bodyFont: {
          size: 12
        },
        padding: 10,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = calculatePercentage(value);
            return `${value} correções (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  const drawerVariants = {
    closed: { x: '100%', opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  if (!isOpen) return null;

  const drawerContent = (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <AnimatePresence mode="wait">
          <motion.div 
            className="w-screen max-w-md h-full bg-gray-900 shadow-xl flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
          >
            {/* Header */}
            <div className="p-1 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500">
              <div className="flex justify-between items-center p-4 bg-gray-900">
                <h2 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-orange-300 inline-block text-transparent bg-clip-text">
                  Estatísticas de Correções
                  {isLoading && (
                    <span className="text-xs ml-2 font-normal text-gray-400">
                      <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1"></span>
                      atualizando...
                    </span>
                  )}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Actions */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex space-x-3">
                <Link 
                  href="/referencias/adicionar" 
                  className="flex-1 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors text-sm flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Referência
                </Link>
                
                <Link 
                  href="/referencias/importar" 
                  className="flex-1 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors text-sm flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Importar Referências
                </Link>
              </div>
              
              <button
                onClick={() => setShowChart(!showChart)}
                className="mt-3 w-full py-2 px-3 bg-gradient-to-r from-rose-500/20 to-orange-500/20 hover:from-rose-500/30 hover:to-orange-500/30 text-gray-200 rounded-md transition-colors text-sm flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showChart ? (
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  ) : (
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  )}
                </svg>
                {showChart ? "Ocultar Gráfico de Distribuição" : "Mostrar Gráfico de Distribuição"}
              </button>
            </div>
            
            {/* Stats content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="space-y-4">
                <div className="p-0.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-orange-500/20">
                  <div className="p-4 bg-gray-800/70 rounded-md">
                    <h3 className="text-sm font-medium text-gray-300 mb-4">Correções por Norma</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                        <div className="mr-3 w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">ABNT</div>
                          <div className="text-lg font-medium text-white">
                            {stats.abntCorrections?.toLocaleString() || '0'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                        <div className="mr-3 w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">APA</div>
                          <div className="text-lg font-medium text-white">
                            {stats.apaCorrections?.toLocaleString() || '0'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                        <div className="mr-3 w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Vancouver</div>
                          <div className="text-lg font-medium text-white">
                            {stats.vancouverCorrections?.toLocaleString() || '0'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                        <div className="mr-3 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">MLA</div>
                          <div className="text-lg font-medium text-white">
                            {stats.mlaCorrections?.toLocaleString() || '0'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-0.5 rounded-lg bg-gradient-to-r from-pink-500/20 to-rose-500/20">
                  <div className="p-4 bg-gray-800/70 rounded-md">
                    <div className="flex items-center">
                      <div className="mr-4 w-14 h-14 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Total de Correções</div>
                        <div className="text-3xl font-bold text-white">
                          {stats.totalCorrections?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Gráfico */}
                <AnimatePresence mode="wait">
                  {showChart && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-0.5 rounded-lg bg-gradient-to-r from-orange-500/20 to-amber-500/20"
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 bg-gray-800/70 rounded-md">
                        <h3 className="text-sm font-medium text-gray-300 mb-4">Distribuição de Correções</h3>
                        
                        <div className="h-64 w-full relative">
                          <Doughnut data={chartData} options={chartOptions} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="flex items-center p-2 bg-gray-700/30 rounded-md">
                            <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
                            <div className="text-xs">
                              <div className="text-gray-300">ABNT</div>
                              <div className="text-gray-400">{calculatePercentage(stats.abntCorrections)}%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-2 bg-gray-700/30 rounded-md">
                            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                            <div className="text-xs">
                              <div className="text-gray-300">APA</div>
                              <div className="text-gray-400">{calculatePercentage(stats.apaCorrections)}%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-2 bg-gray-700/30 rounded-md">
                            <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                            <div className="text-xs">
                              <div className="text-gray-300">Vancouver</div>
                              <div className="text-gray-400">{calculatePercentage(stats.vancouverCorrections)}%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-2 bg-gray-700/30 rounded-md">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                            <div className="text-xs">
                              <div className="text-gray-300">MLA</div>
                              <div className="text-gray-400">{calculatePercentage(stats.mlaCorrections)}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-800 p-4">
              <p className="text-center text-xs text-gray-500">
                As estatísticas são atualizadas automaticamente a cada 30 segundos
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  // Usar o portal seguro para Next.js
  return <ClientOnlyPortal>{drawerContent}</ClientOnlyPortal>;
};

// Componente principal que agora serve como botão para abrir o drawer
const StatsCounter = () => {
  const [stats, setStats] = useState({
    totalCorrections: 0,
    abntCorrections: 0,
    apaCorrections: 0,
    vancouverCorrections: 0,
    mlaCorrections: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setApiError(false);
        
        // Importar logger dinamicamente para evitar problemas de SSR
        const { default: logger } = await import('../utils/logger');
        logger.debug('Componente StatsCounter - carregando estatísticas');
        
        const data = await apiService.getStats();
        
        logger.info('Estatísticas carregadas no componente', { 
          totalCorrections: data.totalCorrections,
          hasStyles: !!data.correctionsByStyle
        });
        
        // Formatar dados para o componente
        setStats({
          totalCorrections: data.totalCorrections || 0,
          abntCorrections: data.correctionsByStyle?.abnt || 0,
          apaCorrections: data.correctionsByStyle?.apa || 0,
          vancouverCorrections: data.correctionsByStyle?.vancouver || 0,
          mlaCorrections: data.correctionsByStyle?.mla || 0
        });
      } catch (error) {
        const { default: logger } = await import('../utils/logger');
        logger.error('Erro ao carregar estatísticas no componente', error);
        
        setApiError(true);
        // Configurar dados de fallback para quando a API estiver indisponível
        setStats({
          totalCorrections: 0,
          abntCorrections: 0,
          apaCorrections: 0,
          vancouverCorrections: 0,
          mlaCorrections: 0
        });
        
        // Registrar esse evento para monitoramento de UX
        logger.userAction('stats_loading_failed', { 
          errorType: error.message,
          retry: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <button 
        onClick={handleOpenDrawer}
        className="bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm flex items-center hover:bg-gray-800/70 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <div className="text-xs text-gray-400 flex items-center">
            Estatísticas
            {isLoading && (
              <span className="ml-2 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            )}
            {apiError && (
              <span className="ml-2 text-amber-500 text-xs">(servidor offline)</span>
            )}
          </div>
          <div className="text-lg font-medium text-white">
            {stats.totalCorrections?.toLocaleString() || '0'} correções
          </div>
        </div>
      </button>
      
      <StatsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        stats={stats}
        isLoading={isLoading}
        showChart={showChart}
        setShowChart={setShowChart}
      />
    </>
  );
};

export default StatsCounter;