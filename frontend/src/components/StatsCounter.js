/**
 * File: inovacademico/frontend/src/components/StatsCounter.js
 * Counter for displaying application statistics
 */
import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const StatsCounter = () => {
  const [stats, setStats] = useState({
    totalCorrections: 0,
    abntCorrections: 0,
    apaCorrections: 0,
    vancouverCorrections: 0,
    mlaCorrections: 0
  });
  const [countersVisible, setCountersVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await apiService.getStats();
        
        if (statsData) {
          setStats({
            totalCorrections: statsData.totalCorrections || 0,
            abntCorrections: statsData.abntCorrections || 0,
            apaCorrections: statsData.apaCorrections || 0,
            vancouverCorrections: statsData.vancouverCorrections || 0,
            mlaCorrections: statsData.mlaCorrections || 0
          });
        }
        
        setIsLoading(false);
        // Start counter animations after data is loaded
        setTimeout(() => setCountersVisible(true), 300);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Fetch stats every 60 seconds
    const intervalId = setInterval(fetchStats, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const calculatePercentage = (styleCount, total) => {
    if (total === 0) return 0;
    return Math.round((styleCount / total) * 100);
  };

  // Animation for count-up effect
  const AnimatedCounter = ({ value, label, color, percentage }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      if (!countersVisible) {
        setDisplayValue(0);
        return;
      }
      
      // If value is less than 100, count up more slowly
      const duration = value > 100 ? 1000 : 1500;
      const steps = value > 100 ? 20 : 30;
      const increment = value / steps;
      let count = 0;
      
      const timer = setInterval(() => {
        count += increment;
        setDisplayValue(Math.min(Math.round(count), value));
        
        if (count >= value) {
          clearInterval(timer);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }, [value, countersVisible]);
    
    return (
      <div className={`flex flex-col items-center justify-center ${countersVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        <div className="relative mb-1">
          <span className={`text-2xl font-bold ${color}`}>
            {displayValue.toLocaleString()}
          </span>
          {percentage !== undefined && (
            <span className="ml-1 text-xs text-gray-400">({percentage}%)</span>
          )}
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-lg shadow-md border border-rose-900/20 overflow-hidden transition-all duration-300 hover:shadow-rose-500/5">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20v-6M6 20V10M18 20V4" />
            </svg>
            Estatísticas
          </h3>
          <div className="text-xs text-gray-500 flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
            Ao vivo
          </div>
        </div>
        
        {isLoading ? (
          <div className="h-16 flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="col-span-2 flex justify-center pb-1 border-b border-gray-800">
                <AnimatedCounter 
                  value={stats.totalCorrections} 
                  label="Total de correções" 
                  color="text-rose-400" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-1 pt-1">
              <AnimatedCounter 
                value={stats.abntCorrections} 
                label="ABNT" 
                color="text-orange-400" 
                percentage={calculatePercentage(stats.abntCorrections, stats.totalCorrections)} 
              />
              <AnimatedCounter 
                value={stats.apaCorrections} 
                label="APA" 
                color="text-rose-400" 
                percentage={calculatePercentage(stats.apaCorrections, stats.totalCorrections)} 
              />
              <AnimatedCounter 
                value={stats.vancouverCorrections} 
                label="Vancouver" 
                color="text-orange-300" 
                percentage={calculatePercentage(stats.vancouverCorrections, stats.totalCorrections)} 
              />
              <AnimatedCounter 
                value={stats.mlaCorrections} 
                label="MLA" 
                color="text-rose-300" 
                percentage={calculatePercentage(stats.mlaCorrections, stats.totalCorrections)} 
              />
            </div>
            
            <div className="mt-3 pt-2 border-t border-gray-800">
              <div className="flex h-2 rounded-full overflow-hidden bg-gray-700/50">
                <div 
                  className="bg-orange-500 transition-all duration-1000 ease-out" 
                  style={{ 
                    width: `${calculatePercentage(stats.abntCorrections, stats.totalCorrections)}%`,
                    opacity: countersVisible ? 1 : 0 
                  }} 
                />
                <div 
                  className="bg-rose-500 transition-all duration-1000 ease-out" 
                  style={{ 
                    width: `${calculatePercentage(stats.apaCorrections, stats.totalCorrections)}%`,
                    opacity: countersVisible ? 1 : 0 
                  }} 
                />
                <div 
                  className="bg-orange-300 transition-all duration-1000 ease-out" 
                  style={{ 
                    width: `${calculatePercentage(stats.vancouverCorrections, stats.totalCorrections)}%`,
                    opacity: countersVisible ? 1 : 0 
                  }} 
                />
                <div 
                  className="bg-rose-300 transition-all duration-1000 ease-out" 
                  style={{ 
                    width: `${calculatePercentage(stats.mlaCorrections, stats.totalCorrections)}%`,
                    opacity: countersVisible ? 1 : 0 
                  }} 
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatsCounter;