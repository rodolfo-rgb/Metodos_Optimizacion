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

const FlujoMaximoSimple = () => {
  const navigate = useNavigate()

  const [sources, setSources] = useState<Source[]>([{ supply: "" }])
  const [destinations, setDestinations] = useState<Destination[]>([{ demand: "" }])
  const [costs, setCosts] = useState<string[][]>([[""]])
  const [solution, setSolution] = useState<Solution | null>(null)

  // Agregar origen (fila)
  const addSource = () => {
    setSources([...sources, { supply: "" }])
    // Agregar una nueva fila con tantos "" como destinos haya
    setCosts([...costs, new Array(destinations.length).fill("")])
  }

  // Eliminar origen (fila)
  const removeSource = (index: number) => {
    if (sources.length > 1) {
      setSources(sources.filter((_, i) => i !== index))
      setCosts(costs.filter((_, i) => i !== index)) // eliminar fila correspondiente
    }
  }

  // Agregar destino (columna)
  const addDestination = () => {
    setDestinations([...destinations, { demand: "" }])
    // Agregar una columna a cada fila existente
    setCosts(costs.map(row => [...row, ""]))
  }

  // Eliminar destino (columna)
  const removeDestination = (index: number) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((_, i) => i !== index))
      setCosts(costs.map(row => row.filter((_, i) => i !== index))) // eliminar columna correspondiente
    }
  }

  // Actualizar oferta de un origen
  const updateSource = (index: number, supply: string) => {
    const newSources = [...sources]
    newSources[index].supply = supply
    setSources(newSources)
  }

  // Actualizar demanda de un destino
  const updateDestination = (index: number, demand: string) => {
    const newDestinations = [...destinations]
    newDestinations[index].demand = demand
    setDestinations(newDestinations)
  }

  // Actualizar costo unitario en matriz
  const updateCost = (sourceIndex: number, destIndex: number, cost: string) => {
    const newCosts = [...costs]
    newCosts[sourceIndex][destIndex] = cost
    setCosts(newCosts)
  }

  // Resolver problema asignando flujo máximo posible y calculando costo total
  const solveProblem = () => {
    const supply = sources.map(s => parseFloat(s.supply) || 0)
    const demand = destinations.map(d => parseFloat(d.demand) || 0)
    const costMatrix = costs.map(row =>
      row.map(c => {
        const parsed = parseFloat(c)
        return isNaN(parsed) ? 0 : parsed
      })
    )

    const allocation = Array(supply.length).fill(null).map(() => Array(demand.length).fill(0))
    const supplyLeft = [...supply]
    const demandLeft = [...demand]

    for (let i = 0; i < supply.length; i++) {
      for (let j = 0; j < demand.length; j++) {
        if (supplyLeft[i] > 0 && demandLeft[j] > 0) {
          const alloc = Math.min(supplyLeft[i], demandLeft[j])
          allocation[i][j] = alloc
          supplyLeft[i] -= alloc
          demandLeft[j] -= alloc
        }
      }
    }

    let totalCost = 0
    for (let i = 0; i < supply.length; i++) {
      for (let j = 0; j < demand.length; j++) {
        totalCost += allocation[i][j] * costMatrix[i][j]
      }
    }

    setSolution({
      allocation,
      totalCost,
      steps: [
        "1. Se permite desbalance entre oferta y demanda.",
        "2. Se usa método de esquina noroeste para asignar máximo flujo posible.",
        "3. Se calcula costo total sumando flujo * costo en cada celda."
      ]
    })
    toast.success("Problema resuelto.")
  }

  // Reiniciar formulario
  const resetForm = () => {
    setSources([{ supply: "" }])
    setDestinations([{ demand: "" }])
    setCosts([[""]])
    setSolution(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Flujo Máximo Simplificado</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8">
        {/* Orígenes */}
        <Card>
          <CardHeader>
            <CardTitle>Orígenes (Oferta)</CardTitle>
            <CardDescription>Agrega o quita orígenes y define sus ofertas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={addSource} size="sm" variant="outline" className="mb-2">
              <Plus className="h-4 w-4 mr-1" /> Agregar Origen
            </Button>
            {sources.map((source, i) => (
              <div key={i} className="flex items-center space-x-2 mb-1">
                <Label className="w-16 font-semibold">O{i + 1}:</Label>
                <Input
                  type="number"
                  placeholder="Oferta"
                  value={source.supply}
                  onChange={(e) => updateSource(i, e.target.value)}
                  className="flex-1"
                />
                {sources.length > 1 && (
                  <Button onClick={() => removeSource(i)} size="sm" variant="destructive">
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Destinos */}
        <Card>
          <CardHeader>
            <CardTitle>Destinos (Demanda)</CardTitle>
            <CardDescription>Agrega o quita destinos y define sus demandas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={addDestination} size="sm" variant="outline" className="mb-2">
              <Plus className="h-4 w-4 mr-1" /> Agregar Destino
            </Button>
            {destinations.map((dest, i) => (
              <div key={i} className="flex items-center space-x-2 mb-1">
                <Label className="w-16 font-semibold">D{i + 1}:</Label>
                <Input
                  type="number"
                  placeholder="Demanda"
                  value={dest.demand}
                  onChange={(e) => updateDestination(i, e.target.value)}
                  className="flex-1"
                />
                {destinations.length > 1 && (
                  <Button onClick={() => removeDestination(i)} size="sm" variant="destructive">
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Matriz de costos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Matriz de Costos</CardTitle>
            <CardDescription>Define el costo unitario de transporte entre orígenes y destinos</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-100"></th>
                  {destinations.map((_, i) => (
                    <th key={i} className="border border-gray-300 p-2 bg-gray-100">D{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sources.map((_, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">O{i + 1}</td>
                    {destinations.map((_, j) => (
                      <td key={j} className="border border-gray-300 p-1">
                        <Input
                          type="number"
                          placeholder="Costo"
                          value={costs[i]?.[j] || ""}
                          onChange={(e) => updateCost(i, j, e.target.value)}
                          className="w-full"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
          <div className="flex space-x-3 mt-4 px-4 pb-4">
            <Button
              onClick={solveProblem}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Resolver
            </Button>
            <Button onClick={resetForm} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </Card>

        {/* Resultados */}
        {solution && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Solución Óptima</CardTitle>
              <CardDescription>Asignación y costo total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto mb-4">
                <table className="w-full border border-gray-300 text-sm">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2 bg-gray-100"></th>
                      {destinations.map((_, i) => (
                        <th key={i} className="border border-gray-300 p-2 bg-gray-100">D{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {solution.allocation.map((row, i) => (
                      <tr key={i}>
                        <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">O{i + 1}</td>
                        {row.map((val, j) => (
                          <td key={j} className="border border-gray-300 p-2 text-center">
                            {val > 0 ? val.toFixed(2) : "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Costo Total</h3>
                <p className="text-xl font-bold">${solution.totalCost.toFixed(2)}</p>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Pasos</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {solution.steps.map((step, i) => (
                    <li key={i} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default FlujoMaximoSimple
