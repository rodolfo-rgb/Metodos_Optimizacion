import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Network, TrendingUp, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const methods = [
    {
      id: "grafico",
      title: "Método Gráfico",
      description: "Resuelve problemas de programación lineal con 2 variables mediante representación gráfica",
      icon: TrendingUp,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      id: "flujo-maximo",
      title: "Flujo Máximo",
      description: "Encuentra el flujo máximo en una red usando el algoritmo Ford-Fulkerson",
      icon: Network,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    },
    {
      id: "costo-minimo",
      title: "Costo Mínimo",
      description: "Optimiza problemas de transporte minimizando costos de distribución",
      icon: Calculator,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Métodos Cuantitativos</h1>
            </div>
            <p className="text-sm text-gray-600 hidden sm:block">Herramientas de Optimización</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Resuelve Problemas de Optimización
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Utiliza métodos cuantitativos avanzados para resolver problemas de programación lineal, 
            flujo en redes y optimización de costos de manera visual e interactiva.
          </p>
        </div>

        {/* Methods Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {methods.map((method) => (
            <Card key={method.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center mb-4`}>
                  <method.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold">{method.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {method.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(`/${method.id}`)}
                  className={`w-full ${method.color} ${method.hoverColor} text-white transition-colors duration-200`}
                >
                  Comenzar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Características Principales
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Cálculos Precisos</h4>
              <p className="text-sm text-gray-600">Algoritmos optimizados para resultados exactos</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Visualización</h4>
              <p className="text-sm text-gray-600">Gráficos interactivos y paso a paso</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Network className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Interfaz Intuitiva</h4>
              <p className="text-sm text-gray-600">Fácil de usar para todos los niveles</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Educativo</h4>
              <p className="text-sm text-gray-600">Explicaciones detalladas del proceso</p>
            </div>
          </div>
        </div>
      </main>
      
      
      {/* Footer */}
      <footer className="bg-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-700">
            © 2025 Equipo 3 - Métodos Cuantitativos.
          </p>
        </div>
      </footer>

    </div>

    
  );
};

export default Index;
