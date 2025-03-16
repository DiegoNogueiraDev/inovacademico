/**
 * File: inovacademico/frontend/src/components/HistoryDrawer.js
 * Drawer component for displaying bibliography correction history
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryDrawer = ({ isOpen, onClose, history, onSelectItem, onClearHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (history && history.length > 0) {
      setIsEmpty(false);
      if (searchTerm) {
        setFilteredHistory(
          history.filter(item => 
            item.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.corrected.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.style && item.style.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        );
      } else {
        setFilteredHistory(history);
      }
    } else {
      setIsEmpty(true);
      setFilteredHistory([]);
    }
  }, [history, searchTerm]);

  const handleClearConfirm = () => {
    setConfirmClear(true);
  };

  const handleClearCancel = () => {
    setConfirmClear(false);
  };

  const handleClearHistory = () => {
    onClearHistory();
    setConfirmClear(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Truncate text to a specific length
  const truncateText = (text, maxLength = 70) => {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  // Group history items by date
  const groupByDate = (items) => {
    const groups = {};
    
    items.forEach(item => {
      const date = new Date(item.timestamp);
      const dateString = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
      
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      
      groups[dateString].push(item);
    });
    
    return groups;
  };
  
  const groupedHistory = groupByDate(filteredHistory);

  const drawerVariants = {
    closed: { x: '100%', opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <AnimatePresence>
        <motion.div 
          className="w-full sm:w-96 md:w-[450px] h-full bg-gray-900 shadow-xl flex flex-col z-10"
          initial="closed"
          animate="open"
          exit="closed"
          variants={drawerVariants}
        >
          {/* Header */}
          <div className="p-1 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500">
            <div className="flex justify-between items-center p-4 bg-gray-900">
              <h2 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-orange-300 inline-block text-transparent bg-clip-text">
                Histórico de Correções
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
          
          {/* Search and actions */}
          <div className="p-4 border-b border-gray-800">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-2 pl-10 text-sm bg-gray-800 rounded-lg border border-gray-700 focus:ring-rose-500 focus:border-rose-500 text-white placeholder-gray-500"
                placeholder="Buscar no histórico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300"
                  onClick={() => setSearchTerm('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {!isEmpty && !confirmClear && (
              <button
                onClick={handleClearConfirm}
                className="text-sm text-gray-400 hover:text-red-400 flex items-center transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                </svg>
                Limpar histórico
              </button>
            )}
            
            {confirmClear && (
              <div className="bg-gray-800/80 rounded-lg p-3 flex flex-col">
                <p className="text-sm text-gray-300 mb-3">Tem certeza que deseja apagar todo o histórico?</p>
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={handleClearCancel}
                    className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-2">Seu histórico está vazio</h3>
                <p className="text-gray-500 text-sm">
                  As correções realizadas aparecerão aqui para que você possa consultá-las novamente quando precisar.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.keys(groupedHistory).length === 0 && searchTerm && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z" />
                      <path d="M16 16l4.5 4.5" />
                    </svg>
                    <p className="text-gray-400">
                      Nenhum resultado encontrado para "{searchTerm}"
                    </p>
                  </div>
                )}
                
                {Object.entries(groupedHistory).map(([date, items]) => (
                  <div key={date} className="mb-4">
                    <div className="flex items-center mb-3">
                      <div className="flex-grow h-px bg-gray-800"></div>
                      <span className="px-3 text-xs font-medium text-gray-500">{date}</span>
                      <div className="flex-grow h-px bg-gray-800"></div>
                    </div>
                    
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <motion.div 
                          key={index}
                          className="p-0.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-orange-500/20 hover:from-rose-500/40 hover:to-orange-500/40 transition-all cursor-pointer"
                          whileHover={{ scale: 1.01 }}
                          onClick={() => onSelectItem(item)}
                        >
                          <div className="p-3 bg-gray-800 rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                {item.style && (
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-rose-600/30 text-rose-300 border border-rose-600/30 uppercase mr-2">
                                    {item.style}
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {formatTimestamp(item.timestamp).split(' ')[1]}
                                </span>
                              </div>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Original:</div>
                                <div className="text-sm text-gray-300 line-clamp-2">
                                  {truncateText(item.original)}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Corrigido:</div>
                                <div className="text-sm text-gray-200 line-clamp-2 font-medium">
                                  {truncateText(item.corrected)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            <p className="text-center text-xs text-gray-500">
              As correções são armazenadas localmente no seu navegador
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HistoryDrawer;