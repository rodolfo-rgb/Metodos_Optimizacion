import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ObjectiveFunctionForm from "@/components/ObjectiveFunctionForm";
import ConstraintsForm from "@/components/ConstraintsForm";
import GraphVisualization from "@/components/GraphVisualization";
import ResultsTable from "@/components/ResultsTable";
import SolutionSteps from "@/components/SolutionSteps";
import { solveGraphicalMethod } from "@/utils/graphicalMethodSolver";

interface Constraint {
  a1: string;
  a2: string;
  type: string;
  b: string;
}

const MetodoGrafico = () => {
  const navigate = useNavigate();
  const [objective, setObjective] = useState("max");
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [constraints, setConstraints] = useState<Constraint[]>([
    { a1: "", a2: "", type: "<=", b: "" },
    { a1: "", a2: "", type: "<=", b: "" }
  ]);
  const [solution, setSolution] = useState<any>(null);

  const addConstraint = () => {
    setConstraints([...constraints, { a1: "", a2: "", type: "<=", b: "" }]);
  };

  const updateConstraint = (index: number, field: string, value: string) => {
    const newConstraints = [...constraints];
    (newConstraints[index] as any)[field] = value;
    setConstraints(newConstraints);
  };

  const removeConstraint = (index: number) => {
    if (constraints.length > 1) {
      setConstraints(constraints.filter((_, i) => i !== index));
    }
  };

  const solveProblem = () => {
    // Validación básica
    if (!c1 || !c2) {
      toast.error("Por favor, complete los coeficientes de la función objetivo");
      return;
    }

    // Verificar que todas las restricciones estén completas
    for (let i = 0; i < constraints.length; i++) {
      const constraint = constraints[i];
      if (!constraint.a1 || !constraint.a2 || !constraint.b) {
        toast.error(`Por favor, complete la restricción ${i + 1}`);
        return;
      }
    }

    // Resolver usando el método gráfico
    try {
      const result = solveGraphicalMethod(objective, c1, c2, constraints);
      setSolution(result);
      toast.success("Problema resuelto exitosamente");
    } catch (error) {
      toast.error("Error al resolver el problema");
    }
  };

  const resetForm = () => {
    setC1("");
    setC2("");
    setConstraints([
      { a1: "", a2: "", type: "<=", b: "" },
      { a1: "", a2: "", type: "<=", b: "" }
    ]);
    setSolution(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
              <h1 className="text-2xl font-bold text-gray-900">Método Gráfico</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Definir Problema</CardTitle>
              <CardDescription>
                Ingrese la función objetivo y las restricciones para resolver por método gráfico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ObjectiveFunctionForm
                objective={objective}
                c1={c1}
                c2={c2}
                onObjectiveChange={setObjective}
                onC1Change={setC1}
                onC2Change={setC2}
              />

              <ConstraintsForm
                constraints={constraints}
                onAddConstraint={addConstraint}
                onUpdateConstraint={updateConstraint}
                onRemoveConstraint={removeConstraint}
              />

              {/* Botones de acción */}
              <div className="flex space-x-3">
                <Button onClick={solveProblem} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Play className="h-4 w-4 mr-2" />
                  Resolver
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
                <CardTitle>Solución Óptima</CardTitle>
                <CardDescription>
                  Resultado del método gráfico con visualización mejorada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Punto Óptimo</h3>
                  <p className="text-green-700">
                    x₁ = {solution.optimalPoint[0].toFixed(2)}, 
                    x₂ = {solution.optimalPoint[1].toFixed(2)}
                  </p>
                  <p className="text-green-700 font-semibold mt-1">
                    Valor óptimo: Z = {solution.optimalValue.toFixed(2)}
                  </p>
                </div>

                <GraphVisualization solution={solution} />

                <ResultsTable solution={solution} c1={c1} c2={c2} />

                <SolutionSteps steps={solution.steps} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default MetodoGrafico;
