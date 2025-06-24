import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Play, RotateCcw, Plus, Minus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

type Source = { supply: string }
type Destination = { demand: string }

type Solution = {
  allocation: number[][]
  totalCost: number
  steps: string[]
}

const CostoMinimo = () => {
  const navigate = useNavigate()

  const [sources, setSources] = useState<Source[]>([{ supply: "" }])
  const [destinations, setDestinations] = useState<Destination[]>([{ demand: "" }])
  const [costs, setCosts] = useState<string[][]>([[""]])
  const [solution, setSolution] = useState<Solution | null>(null)

  const addSource = () => {
    setSources([...sources, { supply: "" }])
    setCosts([...costs, new Array(destinations.length).fill("")])
  }

  const addDestination = () => {
    setDestinations([...destinations, { demand: "" }])
    setCosts(costs.map(row => [...row, ""]))
  }

  const removeSource = (index: number) => {
    if (sources.length > 1) {
      setSources(sources.filter((_, i) => i !== index))
      setCosts(costs.filter((_, i) => i !== index))
    }
  }

  const removeDestination = (index: number) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((_, i) => i !== index))
      setCosts(costs.map(row => row.filter((_, i) => i !== index)))
    }
  }

  const updateSource = (index: number, supply: string) => {
    const newSources = [...sources]
    newSources[index].supply = supply
    setSources(newSources)
  }

  const updateDestination = (index: number, demand: string) => {
    const newDestinations = [...destinations]
    newDestinations[index].demand = demand
    setDestinations(newDestinations)
  }

  const updateCost = (sourceIndex: number, destIndex: number, cost: string) => {
    const newCosts = [...costs]
    newCosts[sourceIndex][destIndex] = cost
    setCosts(newCosts)
  }

  const solveProblem = () => {
    const totalSupply = sources.reduce((sum, s) => sum + parseFloat(s.supply || "0"), 0)
    const totalDemand = destinations.reduce((sum, d) => sum + parseFloat(d.demand || "0"), 0)

    const allCostsValid = costs.every(row =>
      row.every(cell => cell !== "" && !isNaN(parseFloat(cell)))
    )

    if (!allCostsValid) {
      toast.error("Por favor, complete todos los costos con valores numéricos válidos.")
      return
    }

    if (Math.abs(totalSupply - totalDemand) > 0.001) {
      toast.error("La oferta total debe ser igual a la demanda total.")
      return
    }

    try {
      const result = solveTransportationProblem()
      setSolution(result)
      toast.success("Problema resuelto exitosamente")
    } catch (error) {
      toast.error("Error al resolver el problema.")
    }
  }

  const solveTransportationProblem = (): Solution => {
    const supply = sources.map(s => parseFloat(s.supply))
    const demand = destinations.map(d => parseFloat(d.demand))
    const costMatrix = costs.map(row =>
      row.map(c => {
        const parsed = parseFloat(c)
        return isNaN(parsed) ? 0 : parsed
      })
    )

    const allocation = Array(supply.length).fill(null).map(() => Array(demand.length).fill(0))
    let totalCost = 0
    const supplyCopy = [...supply]
    const demandCopy = [...demand]

    let i = 0
    let j = 0
    while (i < supply.length && j < demand.length) {
      const alloc = Math.min(supplyCopy[i], demandCopy[j])
      allocation[i][j] = alloc
      totalCost += alloc * costMatrix[i][j]

      supplyCopy[i] -= alloc
      demandCopy[j] -= alloc

      if (supplyCopy[i] === 0) i++
      if (demandCopy[j] === 0) j++
    }

    return {
      allocation,
      totalCost,
      steps: [
        "1. Verificar que la oferta total = demanda total",
        "2. Aplicar el método de la esquina noroeste",
        "3. Asignar la cantidad máxima posible en cada celda",
        "4. Calcular el costo total de transporte"
      ]
    }
  }

  const resetForm = () => {
    setSources([{ supply: "" }])
    setDestinations([{ demand: "" }])
    setCosts([[""]])
    setSolution(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4" />
                <span>Volver</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Costo Mínimo</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle>Problema de Transporte</CardTitle>
              <CardDescription>
                Configure los orígenes, destinos y costos de transporte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fuentes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">Orígenes (Oferta)</Label>
                  <Button onClick={addSource} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                {sources.map((source, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Label className="w-16">O{index + 1}:</Label>
                    <Input
                      type="number"
                      placeholder="Oferta"
                      value={source.supply}
                      onChange={(e) => updateSource(index, e.target.value)}
                      className="flex-1"
                    />
                    {sources.length > 1 && (
                      <Button
                        onClick={() => removeSource(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Destinos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">Destinos (Demanda)</Label>
                  <Button onClick={addDestination} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                {destinations.map((destination, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Label className="w-16">D{index + 1}:</Label>
                    <Input
                      type="number"
                      placeholder="Demanda"
                      value={destination.demand}
                      onChange={(e) => updateDestination(index, e.target.value)}
                      className="flex-1"
                    />
                    {destinations.length > 1 && (
                      <Button
                        onClick={() => removeDestination(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Matriz de Costos */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Matriz de Costos</Label>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-2 bg-gray-100"></th>
                        {destinations.map((_, index) => (
                          <th key={index} className="border border-gray-300 p-2 bg-gray-100">
                            D{index + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sources.map((_, sourceIndex) => (
                        <tr key={sourceIndex}>
                          <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                            O{sourceIndex + 1}
                          </td>
                          {destinations.map((_, destIndex) => (
                            <td key={destIndex} className="border border-gray-300 p-1">
                              <Input
                                type="number"
                                placeholder="Costo"
                                value={costs[sourceIndex]?.[destIndex] || ""}
                                onChange={(e) =>
                                  updateCost(sourceIndex, destIndex, e.target.value)
                                }
                                className="w-full"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Botones */}
              <div className="flex space-x-3">
                <Button onClick={solveProblem} className="flex-1 bg-purple-600 hover:bg-purple-700">
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

          {/* Resultados */}
          {solution && (
            <Card>
              <CardHeader>
                <CardTitle>Solución Óptima</CardTitle>
                <CardDescription>
                  Resultado del problema de transporte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Costo Total Mínimo</h3>
                  <p className="text-purple-700 text-2xl font-bold">
                    ${solution.totalCost.toFixed(2)}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Asignación Óptima</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-sm">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 p-2 bg-gray-100"></th>
                          {destinations.map((_, index) => (
                            <th key={index} className="border border-gray-300 p-2 bg-gray-100">
                              D{index + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {solution.allocation.map((row, sourceIndex) => (
                          <tr key={sourceIndex}>
                            <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                              O{sourceIndex + 1}
                            </td>
                            {row.map((value, destIndex) => (
                              <td
                                key={destIndex}
                                className="border border-gray-300 p-2 text-center"
                              >
                                {value > 0 ? Math.round(value) : "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Pasos de Solución</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    {solution.steps.map((step, index) => (
                      <li key={index} className="text-gray-700">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default CostoMinimo
