import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface MarketStats {
  totalArtworks: number;
  activeSales: number;
  avgPriceGrowth: number;
  tradingVolume: number;
  totalTransactions: number;
  marketLiquidity: number;
}

export function HeaderStats() {
  const [stats, setStats] = useState<MarketStats>({
    totalArtworks: 1250,
    activeSales: 48,
    avgPriceGrowth: 3.5,
    tradingVolume: 2500000,
    totalTransactions: 856,
    marketLiquidity: 78.5,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch stats from API
        const response = await fetch('/api/stats/market-overview');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching market stats:', error);
      } finally {
        setLoading(false);
      }
    };

    // Use mock data for now
    setLoading(false);
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>
    );
  }

  const isGrowthPositive = stats.avgPriceGrowth >= 0;

  return (
    <div className="flex gap-6 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 overflow-x-auto">
      {/* Total Artworks */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Activity className="text-blue-600" size={18} />
        <div>
          <p className="text-xs text-gray-600">Artworks</p>
          <p className="text-sm font-semibold text-gray-900">{stats.totalArtworks.toLocaleString()}</p>
        </div>
      </div>

      {/* Active Sales */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        <DollarSign className="text-green-600" size={18} />
        <div>
          <p className="text-xs text-gray-600">Active Sales</p>
          <p className="text-sm font-semibold text-gray-900">{stats.activeSales}</p>
        </div>
      </div>

      {/* Price Growth */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        {isGrowthPositive ? (
          <TrendingUp className="text-green-600" size={18} />
        ) : (
          <TrendingDown className="text-red-600" size={18} />
        )}
        <div>
          <p className="text-xs text-gray-600">Avg Growth</p>
          <p className={`text-sm font-semibold ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isGrowthPositive ? '+' : ''}{stats.avgPriceGrowth.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Trading Volume */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        <DollarSign className="text-purple-600" size={18} />
        <div>
          <p className="text-xs text-gray-600">Volume</p>
          <p className="text-sm font-semibold text-gray-900">${(stats.tradingVolume / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Total Transactions */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Activity className="text-indigo-600" size={18} />
        <div>
          <p className="text-xs text-gray-600">Transactions</p>
          <p className="text-sm font-semibold text-gray-900">{stats.totalTransactions.toLocaleString()}</p>
        </div>
      </div>

      {/* Market Liquidity */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        <TrendingUp className="text-orange-600" size={18} />
        <div>
          <p className="text-xs text-gray-600">Liquidity</p>
          <p className="text-sm font-semibold text-gray-900">{stats.marketLiquidity.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
