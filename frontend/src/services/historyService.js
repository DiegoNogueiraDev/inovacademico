/**
 * File: inovacademico/frontend/src/services/historyService.js
 * Service for managing bibliography correction history
 */

// Chave para armazenar o histórico no localStorage
const HISTORY_KEY = 'bibliography_history';

// Número máximo de itens no histórico
const MAX_HISTORY_ITEMS = 50;

const historyService = {
  /**
   * Salva um item no histórico
   * @param {Object} item - Item a ser salvo (contém original, corrected, style, timestamp)
   */
  saveToHistory: (item) => {
    try {
      if (!item || !item.original || !item.corrected) return;
      
      // Adiciona timestamp se não existir
      if (!item.timestamp) {
        item.timestamp = new Date().toISOString();
      }
      
      // Adiciona ID único
      const newItem = {
        ...item,
        id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Recupera histórico existente
      const history = historyService.getHistory();
      
      // Verifica se já existe um item idêntico para evitar duplicatas
      const isDuplicate = history.some(
        existingItem => 
          existingItem.original === newItem.original && 
          existingItem.corrected === newItem.corrected
      );
      
      if (isDuplicate) return;
      
      // Adiciona novo item no início do array
      history.unshift(newItem);
      
      // Limita o tamanho do histórico
      const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);
      
      // Salva no localStorage
      localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Erro ao salvar no histórico:', error);
    }
  },
  
  /**
   * Recupera todo o histórico
   * @returns {Array} Array de itens do histórico
   */
  getHistory: () => {
    try {
      const historyJson = localStorage.getItem(HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Erro ao recuperar histórico:', error);
      return [];
    }
  },
  
  /**
   * Remove um item específico do histórico
   * @param {string} id - ID do item a ser removido
   */
  deleteHistoryItem: (id) => {
    try {
      const history = historyService.getHistory();
      const updatedHistory = history.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Erro ao deletar item do histórico:', error);
    }
  },
  
  /**
   * Limpa todo o histórico
   */
  clearHistory: () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  }
};

export default historyService;