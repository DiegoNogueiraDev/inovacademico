/**
 * File: inovacademico/frontend/src/components/HistoryDrawer.js
 * History drawer component
 */
import { useState, useEffect } from 'react';
import historyService from '../services/historyService';

const HistoryDrawer = ({ onSelectItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    const historyItems = historyService.getHistory();
    setHistory(historyItems);
  };

  const handleClearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
      historyService.clearHistory();
      setHistory([]);
    }
  };

  const handleDeleteItem = (e, id) => {
    e.stopPropagation();
    historyService.deleteHistoryItem(id);
    loadHistory();
  };

  const handleSelectItem = (item) => {
    onSelectItem(item);
    setIsOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-20 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg"
        title="Histórico de correções"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-80 bg-gray-800 shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Histórico</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 h-full overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Seu histórico está vazio.
            </p>
          ) : (
            <>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Limpar histórico
                </button>
              </div>

              <ul className="space-y-3">
                {history.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="bg-gray-700 rounded-md p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-gray-400">
                        {formatDate(item.timestamp)}
                      </span>
                      <button
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        className="text-gray-400 hover:text-red-400"
                        title="Remover do histórico"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-white text-sm mt-1">
                      {truncateText(item.original)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default HistoryDrawer;