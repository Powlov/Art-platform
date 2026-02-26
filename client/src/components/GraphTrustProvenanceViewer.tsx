import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Calendar,
  User,
  Building2,
  Package,
  Link as LinkIcon,
  Shield,
  Info,
  Search,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface ProvenanceNode {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  edgeType: string;
  timestamp: Date;
  verified: boolean;
}

interface ProvenanceChain {
  artworkId: string;
  chain: ProvenanceNode[];
  trustScore: number;
}

interface TrustScoreResult {
  nodeId: string;
  trustScore: number;
  level: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Low';
  factors: {
    baseScore: number;
    verificationBonus: number;
    connectionBonus: number;
    networkTrustBonus: number;
  };
  connectionCount: number;
  verifiedConnections: number;
}

const GraphTrustProvenanceViewer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [artworkId, setArtworkId] = useState('artwork-001');
  const [provenanceChain, setProvenanceChain] = useState<ProvenanceChain | null>(null);
  const [trustScore, setTrustScore] = useState<TrustScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock data для демонстрации (в production заменить на API calls)
  const mockProvenanceData: ProvenanceChain = {
    artworkId: 'artwork-001',
    trustScore: 96.5,
    chain: [
      {
        nodeId: 'artist-001',
        nodeName: 'Василий Кандинский',
        nodeType: 'artist',
        edgeType: 'authentication',
        timestamp: new Date('1923-01-15'),
        verified: true,
      },
      {
        nodeId: 'gallery-001',
        nodeName: 'Третьяковская галерея',
        nodeType: 'gallery',
        edgeType: 'exhibition',
        timestamp: new Date('1924-03-20'),
        verified: true,
      },
      {
        nodeId: 'collector-001',
        nodeName: 'А. Иванов',
        nodeType: 'collector',
        edgeType: 'sale',
        timestamp: new Date('2020-05-15'),
        verified: true,
      },
    ],
  };

  const mockTrustScore: TrustScoreResult = {
    nodeId: 'artwork-001',
    trustScore: 96.5,
    level: 'Excellent',
    factors: {
      baseScore: 85,
      verificationBonus: 10,
      connectionBonus: 1.5,
      networkTrustBonus: 0.0,
    },
    connectionCount: 3,
    verifiedConnections: 3,
  };

  const handleSearch = async () => {
    if (!artworkId.trim()) {
      setError('Введите ID произведения');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/graph/provenance/${artworkId}`);
      // const data = await response.json();

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      setProvenanceChain(mockProvenanceData);
      setTrustScore(mockTrustScore);
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке provenance chain');
      console.error('[Provenance] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'artist':
        return <User className="w-5 h-5" />;
      case 'gallery':
        return <Building2 className="w-5 h-5" />;
      case 'collector':
        return <User className="w-5 h-5" />;
      case 'artwork':
        return <Package className="w-5 h-5" />;
      default:
        return <LinkIcon className="w-5 h-5" />;
    }
  };

  const getEdgeLabel = (edgeType: string) => {
    const labels: Record<string, string> = {
      authentication: 'Аутентификация',
      exhibition: 'Выставка',
      sale: 'Продажа',
      ownership: 'Владение',
      provenance: 'Провенанс',
    };
    return labels[edgeType] || edgeType;
  };

  const getTrustLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      Excellent: 'bg-green-100 text-green-700 border-green-300',
      'Very Good': 'bg-blue-100 text-blue-700 border-blue-300',
      Good: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Fair: 'bg-orange-100 text-orange-700 border-orange-300',
      Low: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[level] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Поиск Provenance Chain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="artworkId">ID произведения</Label>
              <Input
                id="artworkId"
                placeholder="artwork-001"
                value={artworkId}
                onChange={(e) => setArtworkId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Найти
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trust Score Card */}
      {trustScore && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-blue-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Trust Score Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Trust Score</p>
                  <p className="text-5xl font-bold text-blue-600 mb-2">
                    {trustScore.trustScore.toFixed(1)}
                  </p>
                  <Badge className={getTrustLevelColor(trustScore.level)}>
                    {trustScore.level}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Факторы:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Score:</span>
                      <span className="font-semibold">+{trustScore.factors.baseScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verification:</span>
                      <span className="font-semibold text-green-600">
                        +{trustScore.factors.verificationBonus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Connections:</span>
                      <span className="font-semibold">
                        +{trustScore.factors.connectionBonus.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Network Trust:</span>
                      <span className="font-semibold">
                        +{trustScore.factors.networkTrustBonus.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Статистика:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Связей:</span>
                      <span className="font-semibold">{trustScore.connectionCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">Проверенных:</span>
                      <span className="font-semibold text-green-600">
                        {trustScore.verifiedConnections}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Процент:</span>
                      <span className="font-semibold">
                        {((trustScore.verifiedConnections / trustScore.connectionCount) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Provenance Chain Card */}
      {provenanceChain && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-purple-600" />
                Provenance Chain (Цепочка владения)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {provenanceChain.chain.map((node, index) => (
                  <React.Fragment key={node.nodeId}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="relative"
                    >
                      {/* Node Card */}
                      <div className="p-5 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all bg-white">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                              node.verified
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {getNodeIcon(node.nodeType)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-900 truncate">
                                {node.nodeName}
                              </h3>
                              {node.verified && (
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline" className="capitalize">
                                {node.nodeType}
                              </Badge>
                              <Badge className="bg-purple-100 text-purple-700">
                                {getEdgeLabel(node.edgeType)}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(node.timestamp).toLocaleDateString('ru-RU')}</span>
                            </div>
                          </div>

                          {/* Node ID */}
                          <div className="text-xs text-gray-500 font-mono">{node.nodeId}</div>
                        </div>
                      </div>

                      {/* Arrow Connector */}
                      {index < provenanceChain.chain.length - 1 && (
                        <div className="flex justify-center py-2">
                          <ArrowRight className="w-6 h-6 text-purple-400 rotate-90" />
                        </div>
                      )}
                    </motion.div>
                  </React.Fragment>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-700">Итоговый Trust Score цепи:</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-purple-600">
                      {provenanceChain.trustScore.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({provenanceChain.chain.length} узлов в цепи)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Info Card */}
      {!provenanceChain && !loading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">Что такое Provenance Chain?</p>
                <p className="mb-2">
                  Provenance Chain — это полная цепочка владения и событий для произведения искусства,
                  записанная в Graph Trust Module.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Аутентификация художника</li>
                  <li>Выставки в галереях</li>
                  <li>Продажи и смена владельца</li>
                  <li>Trust Score каждого участника цепи</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GraphTrustProvenanceViewer;
