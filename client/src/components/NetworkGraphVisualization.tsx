import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Network,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Filter,
  Info,
  Loader2,
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
import { trpc } from '@/lib/trpc';

interface GraphNode {
  id: string;
  name: string;
  type: 'artist' | 'gallery' | 'artwork' | 'collector' | 'transaction';
  trustScore: number;
  verified: boolean;
  connections?: number;
  digitalId?: string;
  createdAt?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  type: 'authentication' | 'exhibition' | 'sale' | 'ownership' | 'provenance';
  verified: boolean;
}

interface NetworkGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const NetworkGraphVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  const [graphData, setGraphData] = useState<NetworkGraphData>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [draggedNode, setDraggedNode] = useState<GraphNode | null>(null);

  // Fetch graph data from tRPC API
  const { data: graphNodes, isLoading, error, refetch } = trpc.core.getGraphNodes.useQuery({
    limit: 50,
    type: filterType === 'all' ? undefined : filterType as any,
  });

  // Load data from API
  useEffect(() => {
    if (graphNodes && graphNodes.length > 0) {
      // Convert API nodes to graph format
      const nodes: GraphNode[] = graphNodes.map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        trustScore: node.trustScore,
        verified: node.verified,
        connections: node.connections,
        digitalId: node.digitalId,
        createdAt: node.createdAt,
      }));

      // Generate edges based on connections (mock for now)
      const edges: GraphEdge[] = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        if (Math.random() > 0.5 && i + 1 < nodes.length) {
          edges.push({
            source: nodes[i].id,
            target: nodes[i + 1].id,
            type: ['authentication', 'exhibition', 'sale', 'ownership', 'provenance'][Math.floor(Math.random() * 5)] as any,
            verified: Math.random() > 0.2,
          });
        }
      }

      setGraphData({ nodes, edges });
    }
  }, [graphNodes]);
        { source: 'collector-001', target: 'artwork-001', type: 'ownership', verified: true },
        { source: 'artist-002', target: 'artwork-002', type: 'authentication', verified: true },
        { source: 'artwork-002', target: 'gallery-002', type: 'exhibition', verified: true },
        { source: 'artist-003', target: 'artwork-003', type: 'authentication', verified: true },
        { source: 'artwork-003', target: 'gallery-003', type: 'exhibition', verified: true },
        { source: 'collector-002', target: 'artwork-003', type: 'ownership', verified: true },
        { source: 'artwork-001', target: 'artwork-002', type: 'provenance', verified: true },
      ],
    };

    // Initialize node positions
    mockData.nodes.forEach((node, i) => {
      node.x = Math.random() * 600 + 100;
      node.y = Math.random() * 400 + 100;
      node.vx = 0;
      node.vy = 0;
    });

    // Data loaded from API, no longer needed
  }, [graphNodes]);

  // Force-directed graph simulation
  useEffect(() => {
    if (!canvasRef.current || graphData.nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Apply forces
      const alpha = 0.1;
      const centerX = width / 2;
      const centerY = height / 2;

      graphData.nodes.forEach((node) => {
        if (!node.x || !node.y) return;

        // Center force
        node.vx = ((node.vx || 0) + (centerX - node.x) * 0.001) * 0.9;
        node.vy = ((node.vy || 0) + (centerY - node.y) * 0.001) * 0.9;

        // Repulsion between nodes
        graphData.nodes.forEach((other) => {
          if (node === other || !other.x || !other.y) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 1000 / (dist * dist);
          node.vx = (node.vx || 0) + (dx / dist) * force * alpha;
          node.vy = (node.vy || 0) + (dy / dist) * force * alpha;
        });

        // Edge attraction
        graphData.edges.forEach((edge) => {
          const source = graphData.nodes.find((n) => n.id === edge.source);
          const target = graphData.nodes.find((n) => n.id === edge.target);
          if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;

          if (node === source) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            node.vx = (node.vx || 0) + (dx / dist) * 0.5 * alpha;
            node.vy = (node.vy || 0) + (dy / dist) * 0.5 * alpha;
          }
        });

        // Update position
        node.x += node.vx || 0;
        node.y += node.vy || 0;

        // Boundary check
        node.x = Math.max(30, Math.min(width - 30, node.x));
        node.y = Math.max(30, Math.min(height - 30, node.y));
      });

      // Draw edges
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      graphData.edges.forEach((edge) => {
        const source = graphData.nodes.find((n) => n.id === edge.source);
        const target = graphData.nodes.find((n) => n.id === edge.target);
        if (!source || !target || !source.x || !source.y || !target.x || !target.y) return;

        ctx.beginPath();
        ctx.moveTo(source.x * zoomLevel, source.y * zoomLevel);
        ctx.lineTo(target.x * zoomLevel, target.y * zoomLevel);
        ctx.strokeStyle = edge.verified ? '#10b981' : '#94a3b8';
        ctx.stroke();
      });

      // Draw nodes
      graphData.nodes.forEach((node) => {
        if (!node.x || !node.y) return;

        const x = node.x * zoomLevel;
        const y = node.y * zoomLevel;
        const radius = 20;

        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        
        // Color by type
        const colors = {
          artist: '#8b5cf6',
          gallery: '#3b82f6',
          artwork: '#f59e0b',
          collector: '#10b981',
        };
        ctx.fillStyle = colors[node.type];
        ctx.fill();

        // Border for verified
        if (node.verified) {
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, x, y + radius + 15);

        // Trust score
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#6b7280';
        ctx.fillText(`${node.trustScore}%`, x, y + radius + 28);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [graphData, zoomLevel]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoomLevel(1);
    // Re-randomize positions
    const newData = { ...graphData };
    newData.nodes.forEach((node) => {
      node.x = Math.random() * 600 + 100;
      node.y = Math.random() * 400 + 100;
    });
    setGraphData(newData);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;

    const clickedNode = graphData.nodes.find((node) => {
      if (!node.x || !node.y) return false;
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });

    setSelectedNode(clickedNode || null);
  };

  const getNodeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      artist: 'Художник',
      gallery: 'Галерея',
      artwork: 'Произведение',
      collector: 'Коллекционер',
    };
    return labels[type] || type;
  };

  const filteredData = filterType === 'all' 
    ? graphData 
    : {
        nodes: graphData.nodes.filter((n) => n.type === filterType),
        edges: graphData.edges.filter((e) => {
          const source = graphData.nodes.find((n) => n.id === e.source);
          const target = graphData.nodes.find((n) => n.id === e.target);
          return source?.type === filterType || target?.type === filterType;
        }),
      };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p className="text-gray-600">Загрузка данных графа...</p>
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

      {/* Graph Visualization - only show when data is loaded */}
      {!isLoading && !error && graphData.nodes.length > 0 && (
        <>
          {/* Controls Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-purple-600" />
                  Network Graph Visualization
                  <Badge variant="secondary" className="ml-2">
                    {graphData.nodes.length} узлов
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все узлы</SelectItem>
                      <SelectItem value="artist">Художники</SelectItem>
                      <SelectItem value="gallery">Галереи</SelectItem>
                      <SelectItem value="artwork">Произведения</SelectItem>
                      <SelectItem value="collector">Коллекционеры</SelectItem>
                      <SelectItem value="transaction">Транзакции</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm" onClick={handleZoomIn}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleZoomOut}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => refetch()}
                    title="Обновить данные"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                  <span className="text-sm text-gray-600">Художник</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-gray-600">Галерея</span>
                </div>
                <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-600"></div>
              <span className="text-sm text-gray-600">Произведение</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
              <span className="text-sm text-gray-600">Коллекционер</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="w-8 h-1 bg-green-600"></div>
              <span className="text-sm text-gray-600">Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-gray-400"></div>
              <span className="text-sm text-gray-600">Unverified</span>
            </div>
          </div>

          <div
            ref={containerRef}
            className={`border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 ${
              isFullscreen ? 'fixed inset-4 z-50' : ''
            }`}
            style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : '600px' }}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onClick={handleCanvasClick}
              className="w-full h-full cursor-pointer"
            />
          </div>

          <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Кликните на узел для просмотра деталей. Граф автоматически обновляется в реальном времени.</span>
          </div>
        </CardContent>
      </Card>

      {/* Selected Node Details */}
      {selectedNode && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-purple-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Детали узла: {selectedNode.name}
                <Badge>{getNodeTypeLabel(selectedNode.type)}</Badge>
                {selectedNode.verified && (
                  <Badge className="bg-green-100 text-green-700">Verified ✓</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ID</p>
                  <p className="font-mono text-sm">{selectedNode.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Trust Score</p>
                  <p className="text-2xl font-bold text-purple-600">{selectedNode.trustScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Тип</p>
                  <p className="font-semibold">{getNodeTypeLabel(selectedNode.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Связей</p>
                  <p className="text-lg font-bold">
                    {graphData.edges.filter(
                      (e) => e.source === selectedNode.id || e.target === selectedNode.id
                    ).length}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Связанные узлы:</p>
                <div className="flex flex-wrap gap-2">
                  {graphData.edges
                    .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((edge, idx) => {
                      const connectedId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const connectedNode = graphData.nodes.find((n) => n.id === connectedId);
                      return connectedNode ? (
                        <Badge key={idx} variant="outline" className="cursor-pointer hover:bg-purple-50">
                          {connectedNode.name} ({edge.type})
                        </Badge>
                      ) : null;
                    })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Network Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Статистика сети</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Всего узлов</p>
              <p className="text-2xl font-bold text-purple-600">{graphData.nodes.length}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Связей</p>
              <p className="text-2xl font-bold text-blue-600">{graphData.edges.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {graphData.nodes.filter((n) => n.verified).length}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Avg Trust Score</p>
              <p className="text-2xl font-bold text-orange-600">
                {(graphData.nodes.reduce((sum, n) => sum + n.trustScore, 0) / graphData.nodes.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
      )}

      {/* Empty State */}
      {!isLoading && !error && graphData.nodes.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4">
              <Network className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">Нет данных для отображения</p>
              <Button onClick={() => refetch()}>Загрузить данные</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NetworkGraphVisualization;
