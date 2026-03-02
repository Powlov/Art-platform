import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Activity,
  Eye,
  Ban,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Bell,
  BellOff,
  Loader2,
  Info,
  Radio,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { trpc } from '@/lib/trpc';
import { useWebSocket } from '@/hooks/useWebSocket';
import { 
  exportToCSV, 
  exportToJSON, 
  prepareFraudAlertsForExport, 
  getTimestampForFilename 
} from '@/utils/exportUtils';

interface FraudAlert {
  id: string;
  type: 'wash_trading' | 'price_manipulation' | 'fake_provenance' | 'circular_ownership' | 'rapid_trades' | 'anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  artworkId: string;
  artworkTitle: string;
  description: string;
  evidence: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  resolution?: string;
}

interface FraudStats {
  totalAlerts: number;
  activeAlerts: number;
  resolvedToday: number;
  falsePositiveRate: number;
  avgResponseTime: number;
  criticalAlerts: number;
}

const FraudDetectionDashboard: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [realtimeAlerts, setRealtimeAlerts] = useState<FraudAlert[]>([]);

  // WebSocket connection for real-time updates
  const { isConnected, lastMessage, subscribe } = useWebSocket({
    autoConnect: true,
    onMessage: (message) => {
      if (message.type === 'fraud_alert') {
        const newAlert: FraudAlert = {
          ...message.alert,
          timestamp: new Date(message.alert.timestamp),
          evidence: message.alert.evidence || [],
        };
        
        // Add to realtime alerts
        setRealtimeAlerts((prev) => [newAlert, ...prev].slice(0, 10));
        
        // Show browser notification for critical alerts
        if (notifications && message.alert.severity === 'critical' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('Critical Fraud Alert', {
              body: message.alert.description,
              icon: '/logo.png',
              badge: '/logo.png',
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
          }
        }
        
        // Refetch to update main list
        refetch();
      }
    },
  });

  // Subscribe to fraud alerts on mount
  useEffect(() => {
    if (isConnected) {
      subscribe('fraud_alerts');
    }
  }, [isConnected, subscribe]);

  // Fetch alerts from tRPC API
  const { data: fraudAlerts, isLoading, error, refetch } = trpc.core.getFraudAlerts.useQuery({
    severity: filterSeverity === 'all' ? undefined : filterSeverity as any,
    status: filterStatus === 'all' ? undefined : filterStatus as any,
    limit: 50,
  });

  // Fetch fraud statistics
  const { data: fraudStats } = trpc.core.getFraudStatistics.useQuery();

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'active',
      },
      {
        id: 'alert-002',
        type: 'price_manipulation',
        severity: 'high',
        artworkId: 'artwork-456',
        artworkTitle: 'Городской пейзаж',
        description: 'Резкое завышение цены на 350% за последние 7 дней',
        evidence: [
          { type: 'Price Spike', value: '+350% in 7 days', confidence: 97 },
          { type: 'Low Volume', value: 'Only 2 transactions', confidence: 85 },
          { type: 'No Market Event', value: 'No justification found', confidence: 78 },
        ],
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: 'investigating',
        assignedTo: 'Fraud Team A',
      },
      {
        id: 'alert-003',
        type: 'rapid_trades',
        severity: 'medium',
        artworkId: 'artwork-789',
        artworkTitle: 'Портрет неизвестной',
        description: '8 сделок за последние 15 дней (threshold: 5)',
        evidence: [
          { type: 'Trade Count', value: '8 trades in 15 days', confidence: 100 },
          { type: 'Different Buyers', value: '6 unique parties', confidence: 90 },
        ],
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        status: 'active',
      },
      {
        id: 'alert-004',
        type: 'fake_provenance',
        severity: 'high',
        artworkId: 'artwork-234',
        artworkTitle: 'Натюрморт с фруктами',
        description: 'Подозрение на подделку документов о происхождении',
        evidence: [
          { type: 'Document Inconsistency', value: 'Date mismatch found', confidence: 82 },
          { type: 'Missing Signatures', value: '2 signatures missing', confidence: 95 },
          { type: 'Unverified Gallery', value: 'Gallery not in database', confidence: 70 },
        ],
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'investigating',
        assignedTo: 'Fraud Team B',
      },
    ];

    const mockStats: FraudStats = {
      totalAlerts: 234,
      activeAlerts: 12,
      resolvedToday: 8,
      falsePositiveRate: 3.2,
      avgResponseTime: 4.5,
      criticalAlerts: 2,
    };

    // Data now loaded from API
  }, [fraudAlerts]);

  // Notification effect for new critical alerts
  useEffect(() => {
    if (!fraudAlerts || !notifications) return;

    const criticalAlerts = fraudAlerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      console.log(`[FraudDashboard] ${criticalAlerts.length} critical alert(s) detected`);
      // In production: Browser notification
      // if (Notification.permission === 'granted') {
      //   new Notification('Critical Fraud Alert', { 
      //     body: `${criticalAlerts[0].description}`,
      //     icon: '/logo.png'
      //   });
      // }
    }
  }, [fraudAlerts, notifications]);

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300',
    };
    return colors[severity] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-red-100 text-red-700',
      investigating: 'bg-yellow-100 text-yellow-700',
      resolved: 'bg-green-100 text-green-700',
      false_positive: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      wash_trading: 'Wash Trading',
      price_manipulation: 'Price Manipulation',
      fake_provenance: 'Fake Provenance',
      circular_ownership: 'Circular Ownership',
      rapid_trades: 'Rapid Trades',
      anomaly: 'Anomaly',
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wash_trading':
        return <Activity className="w-4 h-4" />;
      case 'price_manipulation':
        return <TrendingUp className="w-4 h-4" />;
      case 'fake_provenance':
        return <Ban className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredAlerts = (fraudAlerts || []).filter((alert) => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    return true;
  });

  const formatTimeAgo = (date: Date | string) => {
    const alertDate = typeof date === 'string' ? new Date(date) : date;
    const hours = Math.floor((Date.now() - alertDate.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Только что';
    if (hours < 24) return `${hours}ч назад`;
    return `${Math.floor(hours / 24)}д назад`;
  };

  // Export functions
  const handleExportCSV = () => {
    if (!filteredAlerts || filteredAlerts.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    const exportData = prepareFraudAlertsForExport(filteredAlerts);
    const timestamp = getTimestampForFilename();
    const filename = `fraud_alerts_${timestamp}.csv`;
    
    exportToCSV(exportData, filename);
    console.log(`[FraudDashboard] Exported ${filteredAlerts.length} alerts to ${filename}`);
  };

  const handleExportJSON = () => {
    if (!filteredAlerts || filteredAlerts.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    const timestamp = getTimestampForFilename();
    const filename = `fraud_alerts_${timestamp}.json`;
    
    exportToJSON(filteredAlerts, filename);
    console.log(`[FraudDashboard] Exported ${filteredAlerts.length} alerts to ${filename}`);
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p className="text-gray-600">Загрузка данных системы защиты...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center">
                <Info className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900">Ошибка загрузки данных</h4>
                <p className="text-sm text-red-700">{error.message}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => refetch()}
                >
                  Повторить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard - only show when data is loaded */}
      {!isLoading && !error && (
        <>
      {/* Stats Cards */}
      {fraudStats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <Badge className="bg-red-100 text-red-700">Live</Badge>
              </div>
              <p className="text-2xl font-bold text-red-600">{fraudStats.activeAlerts}</p>
              <p className="text-sm text-gray-600">Active Alerts</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <span className="text-xs text-orange-600 font-semibold">CRITICAL</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{fraudStats.criticalAlerts}</p>
              <p className="text-sm text-gray-600">Critical</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-xs text-green-600 font-semibold">TODAY</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{fraudStats.resolvedToday}</p>
              <p className="text-sm text-gray-600">Resolved</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-blue-600 font-semibold">TOTAL</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{fraudStats.totalAlerts}</p>
              <p className="text-sm text-gray-600">All Time</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-xs text-purple-600 font-semibold">AVG</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.avgResponseTime}h</p>
              <p className="text-sm text-gray-600">Response Time</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-5 h-5 text-gray-600" />
                <span className="text-xs text-gray-600 font-semibold">FP RATE</span>
              </div>
              <p className="text-2xl font-bold text-gray-600">{fraudStats.falsePositiveRate}%</p>
              <p className="text-sm text-gray-600">False Positive</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Fraud Detection Dashboard
              {autoRefresh && (
                <Badge className="bg-green-100 text-green-700 animate-pulse">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              )}
              {/* WebSocket Status */}
              {isConnected && (
                <Badge className="bg-blue-100 text-blue-700">
                  <Radio className="w-3 h-3 mr-1 animate-pulse" />
                  WebSocket
                </Badge>
              )}
              {realtimeAlerts.length > 0 && (
                <Badge className="bg-orange-100 text-orange-700">
                  {realtimeAlerts.length} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="false_positive">False Positive</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setNotifications(!notifications)}
              >
                {notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportCSV}
                title="Export to CSV"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-5 border-2 rounded-xl ${
                    alert.severity === 'critical' ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  } hover:shadow-md transition-all`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          alert.severity === 'critical'
                            ? 'bg-red-100'
                            : alert.severity === 'high'
                            ? 'bg-orange-100'
                            : 'bg-yellow-100'
                        }`}
                      >
                        {getTypeIcon(alert.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{alert.artworkTitle}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{getTypeLabel(alert.type)}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(alert.timestamp)}
                          </span>
                          <span className="font-mono">{alert.artworkId}</span>
                          {alert.assignedTo && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {alert.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  {/* Evidence */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-semibold text-gray-700">Evidence:</p>
                    {alert.evidence.map((ev, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{ev.type}</span>
                            <span className="text-xs text-gray-600">{ev.confidence}% confidence</span>
                          </div>
                          <Progress value={ev.confidence} className="h-2" />
                        </div>
                        <span className="text-sm text-gray-600 w-48">{ev.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Investigate
                    </Button>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                    <Button size="sm" variant="outline">
                      <Ban className="w-4 h-4 mr-2" />
                      False Positive
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-gray-600">No alerts match the current filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
};

export default FraudDetectionDashboard;
