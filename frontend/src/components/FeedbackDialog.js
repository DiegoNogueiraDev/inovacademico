/**
 * File: inovacademico/frontend/src/components/FeedbackDialog.js
 * Dialog component for collecting user feedback
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackDialog = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) return;
    
    setSubmitting(true);
    
    try {
      await onSubmit({ rating, comment });
      setSubmitted(true);
      
      // Reset form after 3 seconds and close
      setTimeout(() => {
        setRating(0);
        setComment('');
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <AnimatePresence>
        <motion.div 
          className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top gradient bar */}
          <div className="h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500"></div>
          
          <div className="p-6">
            {submitted ? (
              <motion.div 
                className="py-8 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Obrigado pelo feedback!</h3>
                <p className="text-gray-400 text-center">Sua opinião é muito importante para melhorarmos nosso serviço.</p>
              </motion.div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-orange-300 inline-block text-transparent bg-clip-text">Sua opinião é importante</h2>
                  <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="text-rose-300 font-medium text-sm block mb-3">Como você avalia a correção da bibliografia?</label>
                    <div className="flex justify-center">
                      <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            className={`
                              w-10 h-10 rounded-full flex items-center justify-center transition-all transform
                              ${rating >= value 
                                ? 'bg-gradient-to-br from-rose-500 to-orange-500 text-white scale-110 shadow-lg shadow-rose-500/20' 
                                : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300'
                              }
                            `}
                          >
                            <span className="text-lg">{value}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 px-3">
                      <span>Insatisfeito</span>
                      <span>Excelente</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="comment" className="text-rose-300 font-medium text-sm block mb-2">
                      Algum comentário adicional? (opcional)
                    </label>
                    <div className="relative">
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Compartilhe sua experiência ou sugestões para melhorias..."
                        className="w-full p-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 resize-none h-28"
                      />
                      <div className="absolute inset-0 border border-rose-500/0 rounded-lg pointer-events-none focus-within:border-rose-500/30 transition-colors duration-300"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-300 hover:text-white mr-3 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={rating === 0 || submitting}
                      className={`px-5 py-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-medium rounded-lg shadow-lg transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        rating === 0 || submitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        {submitting ? (
                          <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        Enviar Feedback
                      </div>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FeedbackDialog;