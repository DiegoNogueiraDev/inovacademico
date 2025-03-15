/**
 * File: inovacademico/frontend/src/components/StatsCounter.js
 * Stats counter component
 */
import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const StatsCounter = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await apiService.getStats();
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Não foi possível carregar as estatísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-10 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg text-gray-400 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-purple-400 text-sm font-medium mb-1">Total de bibliografias corrigidas</h3>
      <div className="flex items-center justify-center">
        <div className="text-4xl font-bold text-green-500">{stats?.totalCorrections.toLocaleString()}</div>
        
        {stats?.averageRating > 0 && (
          <div className="ml-4 flex items-center">
            <div className="text-sm text-gray-400 mr-1">Avaliação média:</div>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-white">{stats.averageRating}</span>
            </div>
          </div>
        )}
      </div>
      
      {stats && stats.correctionsByStyle && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>ABNT:</span>
            <span className="font-medium text-gray-300">{stats.correctionsByStyle.abnt}</span>
          </div>
          <div className="flex justify-between">
            <span>APA:</span>
            <span className="font-medium text-gray-300">{stats.correctionsByStyle.apa}</span>
          </div>
          <div className="flex justify-between">
            <span>Vancouver:</span>
            <span className="font-medium text-gray-300">{stats.correctionsByStyle.vancouver}</span>
          </div>
          <div className="flex justify-between">
            <span>MLA:</span>
            <span className="font-medium text-gray-300">{stats.correctionsByStyle.mla}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCounter;