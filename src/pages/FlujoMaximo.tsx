import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, RotateCcw, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const FlujoMaximo = () => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState(["S", "T"]);
  const [edges, setEdges] = useState([{ from: "", to: "", capacity: "" }]);
  const [solution, setSolution] = useState(null);

  const addNode = () => {
    const nodeNumber = nodes.length - 1;
    setNodes([...nodes.slice(0, -1), `N${nodeNumber}`, "T"]);
  };

  const addEdge = () => {
    setEdges([...edges, { from: "", to: "", capacity: "" }]);
  };

  const updateEdge = (index, field, value) => {
    const newEdges = [...edges];
    newEdges[index][field] = value;
    setEdges(newEdges);
  };

  const removeEdge = (index) => {
    if (edges.length > 1) {
      setEdges(edges.filter((_, i) => i !== index));
    }
  };

  const solveProblem = () => {
    // Validación básica
    if (edges.some(edge => !edge.from || !edge.to || !edge.capacity)) {
      toast.error("Por favor, complete todas las aristas");
      return;
    }

    try {
      const result = fordFulkerson();
      setSolution(result);
      toast.success("Flujo máximo calculado exitosamente");
    } catch (error) {
      toast.error("Error al calcular el flujo máximo");
    }
  };

  const fordFulkerson = () => {
    // Implementación simplificada del algoritmo Ford-Fulkerson
    const adjacencyList = {};
    const capacities = {};

    // Inicializar estructura de datos
    nodes.forEach(node => {
      adjacencyList[node] = [];
    });

    edges.forEach(edge => {
      const from = edge.from;
      const to = edge.to;
      const capacity = parseFloat(edge.capacity);

      if (!adjacencyList[from].includes(to)) {
        adjacencyList[from].push(to);
      }
      if (!adjacencyList[to].includes(from)) {
        adjacencyList[to].push(from);
      }

      capacities[`${from}-${to}`] = capacity;
      if (!capacities[`${to}-${from}`]) {
        capacities[`${to}-${from}`] = 0;
      }
    });

    let maxFlow = 0;
    const flows = {};

    // Inicializar flujos
    Object.keys(capacities).forEach(key => {
      flows[key] = 0;
    });

    // Algoritmo simplificado - encontrar caminos aumentantes
    const paths = [];
    let iterations = 0;

    while (iterations < 10) { // Límite para evitar bucles infinitos
      const path = findAugmentingPath(adjacencyList, capacities, flows, "S", "T");
      if (!path || path.length === 0) break;

      const bottleneck = findBottleneck(path, capacities, flows);
      if (bottleneck <= 0) break;

      // Actualizar flujos
      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        flows[`${from}-${to}`] = (flows[`${from}-${to}`] || 0) + bottleneck;
        flows[`${to}-${from}`] = (flows[`${to}-${from}`] || 0) - bottleneck;
      }

      maxFlow += bottleneck;
      paths.push({ path: [...path], flow: bottleneck });
      iterations++;
    }

    return {
      maxFlow,
      paths,
      steps: [
        "1. Inicializar la red con capacidades originales",
        "2. Buscar camino aumentante desde fuente a sumidero",
        "3. Encontrar la capacidad mínima en el camino (cuello de botella)",
        "4. Actualizar flujos en el camino encontrado",
        "5. Repetir hasta que no existan más caminos aumentantes"
      ]
    };
  };

  const findAugmentingPath = (adjacencyList, capacities, flows, source, sink) => {
    const visited = new Set();
    const queue = [{ node: source, path: [source] }];

    while (queue.length > 0) {
      const { node, path } = queue.shift();
      
      if (node === sink) {
        return path;
      }

      if (visited.has(node)) continue;
      visited.add(node);

      for (const neighbor of adjacencyList[node] || []) {
        const edgeKey = `${node}-${neighbor}`;
        const capacity = capacities[edgeKey] || 0;
        const flow = flows[edgeKey] || 0;
        
        if (!visited.has(neighbor) && capacity > flow) {
          queue.push({ node: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return null;
  };

  const findBottleneck = (path, capacities, flows) => {
    let minCapacity = Infinity;

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      const edgeKey = `${from}-${to}`;
      const capacity = capacities[edgeKey] || 0;
      const flow = flows[edgeKey] || 0;
      const remainingCapacity = capacity - flow;

      minCapacity = Math.min(minCapacity, remainingCapacity);
    }

    return minCapacity === Infinity ? 0 : minCapacity;
  };

  const resetForm = () => {
    setNodes(["S", "T"]);
    setEdges([{ from: "", to: "", capacity: "" }]);
    setSolution(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Flujo Máximo</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Red de Flujo</CardTitle>
              <CardDescription>
                Configure los nodos y aristas de la red para calcular el flujo máximo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nodos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">Nodos</Label>
                  <Button onClick={addNode} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Nodo
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {nodes.map((node, index) => (
                    <div key={index} className="bg-blue-100 px-3 py-1 rounded-full text-sm font-medium">
                      {node}
                    </div>
                  ))}
                </div>
              </div>

              {/* Aristas */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">Aristas (Capacidades)</Label>
                  <Button onClick={addEdge} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Arista
                  </Button>
                </div>
                
                {edges.map((edge, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-3 p-3 border rounded-lg">
                    <select
                      value={edge.from}
                      onChange={(e) => updateEdge(index, "from", e.target.value)}
                      className="px-3 py-1 border rounded"
                    >
                      <option value="">Desde</option>
                      {nodes.map(node => (
                        <option key={node} value={node}>{node}</option>
                      ))}
                    </select>
                    <span>→</span>
                    <select
                      value={edge.to}
                      onChange={(e) => updateEdge(index, "to", e.target.value)}
                      className="px-3 py-1 border rounded"
                    >
                      <option value="">Hacia</option>
                      {nodes.map(node => (
                        <option key={node} value={node}>{node}</option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      placeholder="Capacidad"
                      value={edge.capacity}
                      onChange={(e) => updateEdge(index, "capacity", e.target.value)}
                      className="w-24"
                    />
                    {edges.length > 1 && (
                      <Button
                        onClick={() => removeEdge(index)}
                        size="sm"
                        variant="destructive"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-3">
                <Button onClick={solveProblem} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Calcular Flujo Máximo
                </Button>
                <Button onClick={resetForm} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {solution && (
            <Card>
              <CardHeader>
                <CardTitle>Flujo Máximo</CardTitle>
                <CardDescription>
                  Resultado del algoritmo Ford-Fulkerson
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Flujo Máximo</h3>
                  <p className="text-green-700 text-3xl font-bold">
                    {solution.maxFlow}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Caminos Aumentantes</h3>
                  <div className="space-y-2">
                    {solution.paths.map((pathInfo, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="text-sm">
                          <span className="font-medium">Camino {index + 1}:</span> {pathInfo.path.join(" → ")}
                        </p>
                        <p className="text-sm text-gray-600">
                          Flujo: {pathInfo.flow}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Pasos del Algoritmo</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    {solution.steps.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default FlujoMaximo;
