/**
 * File: inovacademico/frontend/src/services/historyService.js
 * Service for managing correction history
 */

/**
 * Service for managing bibliography correction history in localStorage
 */
const HISTORY_KEY = 'inovacademico_history';
const MAX_HISTORY_ITEMS = 10;

const historyService = {
  /**
   * Save a correction to history
   * @param {Object} correction - The correction data with original and corrected text
   */
  saveToHistory(correction) {
    try {
      const history = this.getHistory();
      
      // Create history item with timestamp
      const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        original: correction.original,
        corrected: correction.corrected
      };
      
      // Add to beginning of array
      history.unshift(historyItem);
      
      // Limit history size
      if (history.length > MAX_HISTORY_ITEMS) {
        history.pop();
      }
      
      // Save back to localStorage
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      
      return historyItem;
    } catch (error) {
      console.error('Error saving to history:', error);
      return null;
    }
  },
  
  /**
   * Get correction history
   * @returns {Array} - Array of history items
   */
  getHistory() {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error('Error retrieving history:', error);
      return [];
    }
  },
  
  /**
   * Clear all history
   */
  clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
  },
  
  /**
   * Delete a specific history item
   * @param {number} id - The ID of the history item to delete
   */
  deleteHistoryItem(id) {
    try {
      let history = this.getHistory();
      history = history.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('Error deleting history item:', error);
      return false;
    }
  }
};

export default historyService;