interface ResultsTableProps {
  solution: any;
  c1: string;
  c2: string;
}

const ResultsTable = ({ solution, c1, c2 }: ResultsTableProps) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">Vértices de la Región Factible</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Vértice</th>
              <th className="border border-gray-300 p-2">x₁</th>
              <th className="border border-gray-300 p-2">x₂</th>
              <th className="border border-gray-300 p-2">Z = {c1}x₁ + {c2}x₂</th>
            </tr>
          </thead>
          <tbody>
            {solution.vertices.map((vertex: number[], index: number) => {
              const zValue = parseFloat(c1) * vertex[0] + parseFloat(c2) * vertex[1];
              const isOptimal = Math.abs(vertex[0] - solution.optimalPoint[0]) < 0.001 && 
                              Math.abs(vertex[1] - solution.optimalPoint[1]) < 0.001;
              return (
                <tr key={index} className={isOptimal ? "bg-green-100" : ""}>
                  <td className="border border-gray-300 p-2 text-center">V{index + 1}</td>
                  <td className="border border-gray-300 p-2 text-center">{vertex[0].toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-center">{vertex[1].toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-center font-semibold">
                    {zValue.toFixed(2)}
                    {isOptimal && <span className="text-green-600 ml-1">*</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
