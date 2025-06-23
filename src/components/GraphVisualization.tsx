import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from "recharts";

interface GraphVisualizationProps {
  solution: any;
}

const GraphVisualization = ({ solution }: GraphVisualizationProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-semibold mb-4">Visualización Gráfica</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              domain={[0, solution.maxX]}
              label={{ value: 'x₁', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              domain={[0, solution.maxY]}
              label={{ value: 'x₂', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                typeof value === 'number' ? value.toFixed(2) : value, 
                name === 'x' ? 'x₁' : 'x₂'
              ]}
            />
            
            {/* Líneas de restricciones */}
            {solution.constraintLines.map((lineData: any[], index: number) => (
              <Line
                key={`constraint-${index}`}
                data={lineData}
                type="monotone"
                dataKey="y"
                stroke={`hsl(${index * 60}, 70%, 50%)`}
                strokeWidth={2}
                dot={false}
                name={`Restricción ${index + 1}`}
              />
            ))}
            
            {/* Región factible - puntos */}
            <Scatter 
              data={solution.feasibleRegion} 
              fill="#3b82f6"
              fillOpacity={0.1}
              name="Región Factible"
            >
              {solution.feasibleRegion.map((_: any, index: number) => (
                <Cell key={index} fill="#3b82f6" fillOpacity={0.1} />
              ))}
            </Scatter>
            
            {/* Líneas que conectan los vértices para formar el contorno */}
            {solution.sortedVertices.length > 1 && (
              <Line
                data={[...solution.sortedVertices.map((v: number[]) => ({ x: v[0], y: v[1] })), { x: solution.sortedVertices[0][0], y: solution.sortedVertices[0][1] }]}
                type="linear"
                dataKey="y"
                stroke="#1e40af"
                strokeWidth={3}
                dot={false}
                name="Contorno región factible"
              />
            )}
            
            {/* Vértices */}
            <Scatter 
              data={solution.vertices.map((v: number[]) => ({ x: v[0], y: v[1] }))} 
              fill="#ef4444"
              name="Vértices"
            >
              {solution.vertices.map((_: any, index: number) => (
                <Cell key={index} fill="#ef4444" />
              ))}
            </Scatter>
            
            {/* Punto óptimo */}
            <Scatter 
              data={[{ x: solution.optimalPoint[0], y: solution.optimalPoint[1] }]} 
              fill="#10b981"
              name="Punto Óptimo"
            >
              <Cell fill="#10b981" />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4 text-sm flex-wrap">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 opacity-20 rounded border-2 border-blue-500 border-dashed"></div>
          <span>Región Factible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-700 rounded"></div>
          <span>Contorno</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Vértices</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Punto Óptimo</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;
