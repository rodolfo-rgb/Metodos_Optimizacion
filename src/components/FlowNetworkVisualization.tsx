import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useCallback, useEffect } from "react";

interface Node {
  id: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  capacity: number;
  flow?: number;
}

interface FlowNetworkVisualizationProps {
  nodes: string[];
  edges: Edge[];
  paths?: Array<{ path: string[]; flow: number }>;
}

const FlowNetworkVisualization = ({ nodes, edges, paths = [] }: FlowNetworkVisualizationProps) => {
  // Generar posiciones iniciales para los nodos en un layout que se ajuste al tamaño del SVG
  const generateInitialNodePositions = (nodeList: string[]): Node[] => {
    const svgWidth = 400;
    const svgHeight = 300;
    const nodeRadius = 20;
    const margin = 30;
    
    // Área efectiva donde pueden estar los nodos
    const effectiveWidth = svgWidth - 2 * margin;
    const effectiveHeight = svgHeight - 2 * margin;
    
    return nodeList.map((node, index) => {
      let x, y;
      
      if (node === "S") {
        // Fuente a la izquierda
        x = margin + nodeRadius;
        y = svgHeight / 2;
      } else if (node === "T") {
        // Sumidero a la derecha
        x = svgWidth - margin - nodeRadius;
        y = svgHeight / 2;
      } else {
        // Nodos intermedios en el centro
        const intermediateNodes = nodeList.filter(n => n !== "S" && n !== "T");
        const intermediateIndex = intermediateNodes.indexOf(node);
        const totalIntermediateNodes = intermediateNodes.length;
        
        if (totalIntermediateNodes === 1) {
          // Un solo nodo intermedio en el centro
          x = svgWidth / 2;
          y = svgHeight / 2;
        } else if (totalIntermediateNodes <= 6) {
          // Pocos nodos: disposición circular en el centro
          const centerX = svgWidth / 2;
          const centerY = svgHeight / 2;
          const radius = Math.min(effectiveWidth, effectiveHeight) / 4;
          const angle = (intermediateIndex * 2 * Math.PI) / totalIntermediateNodes;
          
          x = centerX + radius * Math.cos(angle);
          y = centerY + radius * Math.sin(angle);
        } else {
          // Muchos nodos: disposición en grid
          const cols = Math.ceil(Math.sqrt(totalIntermediateNodes));
          const rows = Math.ceil(totalIntermediateNodes / cols);
          
          const col = intermediateIndex % cols;
          const row = Math.floor(intermediateIndex / cols);
          
          const gridWidth = effectiveWidth * 0.6; // Usar 60% del ancho disponible
          const gridHeight = effectiveHeight * 0.6; // Usar 60% del alto disponible
          
          x = margin + effectiveWidth * 0.2 + (col * gridWidth) / (cols - 1 || 1);
          y = margin + effectiveHeight * 0.2 + (row * gridHeight) / (rows - 1 || 1);
        }
        
        // Asegurar que el nodo esté dentro de los límites
        x = Math.max(margin, Math.min(svgWidth - margin, x));
        y = Math.max(margin, Math.min(svgHeight - margin, y));
      }
      
      return { id: node, x, y };
    });
  };

  const [nodePositions, setNodePositions] = useState<Node[]>(() => 
    generateInitialNodePositions(nodes)
  );
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Actualizar posiciones cuando cambian los nodos
  useEffect(() => {
    setNodePositions(generateInitialNodePositions(nodes));
  }, [nodes]);

  const getNodePosition = (nodeId: string) => {
    return nodePositions.find(n => n.id === nodeId) || { x: 50, y: 50 };
  };

  // Colores para diferentes caminos
  const pathColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  const getEdgeColor = (from: string, to: string): string => {
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i].path;
      for (let j = 0; j < path.length - 1; j++) {
        if (path[j] === from && path[j + 1] === to) {
          return pathColors[i % pathColors.length];
        }
      }
    }
    return '#6b7280';
  };

  const isEdgeInPath = (from: string, to: string): boolean => {
    return paths.some(({ path }) => {
      for (let i = 0; i < path.length - 1; i++) {
        if (path[i] === from && path[i + 1] === to) {
          return true;
        }
      }
      return false;
    });
  };

  const handleMouseDown = useCallback((event: React.MouseEvent, nodeId: string) => {
    event.preventDefault();
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
    const svgRect = (event.currentTarget as SVGElement).closest('svg')?.getBoundingClientRect();
    if (!svgRect) return;

    const node = getNodePosition(nodeId);
    setDraggedNode(nodeId);
    setDragOffset({
      x: event.clientX - svgRect.left - node.x,
      y: event.clientY - svgRect.top - node.y
    });
  }, [nodePositions]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!draggedNode) return;

    const svgRect = (event.currentTarget as SVGElement).getBoundingClientRect();
    const newX = event.clientX - svgRect.left - dragOffset.x;
    const newY = event.clientY - svgRect.top - dragOffset.y;

    // Mantener los nodos dentro de los límites del SVG con margen para el radio del nodo
    const nodeRadius = 20;
    const constrainedX = Math.max(nodeRadius + 5, Math.min(400 - nodeRadius - 5, newX));
    const constrainedY = Math.max(nodeRadius + 5, Math.min(300 - nodeRadius - 5, newY));

    setNodePositions(prev => 
      prev.map(node => 
        node.id === draggedNode 
          ? { ...node, x: constrainedX, y: constrainedY }
          : node
      )
    );
  }, [draggedNode, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Visualización del Grafo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg 
            width="400" 
            height="300" 
            className="border rounded cursor-default"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Aristas */}
            {edges.map((edge, index) => {
              const fromPos = getNodePosition(edge.from);
              const toPos = getNodePosition(edge.to);
              const color = getEdgeColor(edge.from, edge.to);
              const isHighlighted = isEdgeInPath(edge.from, edge.to);
              
              // Calcular punto medio para la etiqueta
              const midX = (fromPos.x + toPos.x) / 2;
              const midY = (fromPos.y + toPos.y) / 2;
              
              return (
                <g key={index}>
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={color}
                    strokeWidth={isHighlighted ? 3 : 2}
                    markerEnd="url(#arrowhead)"
                  />
                  <circle
                    cx={midX}
                    cy={midY}
                    r="12"
                    fill="white"
                    stroke={color}
                    strokeWidth="1"
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fill={color}
                    fontWeight="bold"
                  >
                    {edge.capacity}
                  </text>
                </g>
              );
            })}
            
            {/* Definir marcador de flecha */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6b7280"
                />
              </marker>
            </defs>
            
            {/* Nodos */}
            {nodePositions.map((node) => (
              <g 
                key={node.id}
                style={{ cursor: draggedNode === node.id ? 'grabbing' : 'grab' }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill={node.id === "S" ? "#10b981" : node.id === "T" ? "#ef4444" : "#3b82f6"}
                  stroke="white"
                  strokeWidth="2"
                  style={{
                    filter: draggedNode === node.id ? 'brightness(1.1)' : 'none',
                    transition: draggedNode === node.id ? 'none' : 'filter 0.2s'
                  }}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fill="white"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.id}
                </text>
              </g>
            ))}
          </svg>
          
          {/* Leyenda de caminos */}
          {paths.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Caminos Encontrados:</h4>
              <div className="space-y-1">
                {paths.map((pathInfo, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: pathColors[index % pathColors.length] }}
                    />
                    <span>
                      {pathInfo.path.join(" → ")} (Flujo: {pathInfo.flow})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowNetworkVisualization;
