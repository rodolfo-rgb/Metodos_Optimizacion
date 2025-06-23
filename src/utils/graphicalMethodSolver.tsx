interface Constraint {
  a1: string;
  a2: string;
  type: string;
  b: string;
}

interface ConstraintMatrix {
  coeffs: number[];
  type: string;
  rhs: number;
}

export const solveGraphicalMethod = (
  objective: string,
  c1: string,
  c2: string,
  constraints: Constraint[]
) => {
  const objectiveCoeffs = [parseFloat(c1), parseFloat(c2)];
  const constraintMatrix: ConstraintMatrix[] = constraints.map(c => ({
    coeffs: [parseFloat(c.a1), parseFloat(c.a2)],
    type: c.type,
    rhs: parseFloat(c.b)
  }));

  // Generar datos para el gráfico
  const maxX = Math.max(...constraintMatrix.map(c => c.rhs / Math.abs(c.coeffs[0] || 1))) + 2;
  const maxY = Math.max(...constraintMatrix.map(c => c.rhs / Math.abs(c.coeffs[1] || 1))) + 2;

  // Generar líneas de restricciones
  const constraintLines = constraintMatrix.map((constraint, index) => {
    const points = [];
    for (let x = 0; x <= maxX; x += 0.5) {
      if (constraint.coeffs[1] !== 0) {
        const y = (constraint.rhs - constraint.coeffs[0] * x) / constraint.coeffs[1];
        if (y >= 0 && y <= maxY) {
          points.push({ x, y, constraint: index });
        }
      }
    }
    return points;
  });

  // Encontrar vértices de la región factible
  const vertices: number[][] = [];
  
  // Agregar origen si es factible
  if (isFeasible(0, 0, constraintMatrix)) {
    vertices.push([0, 0]);
  }
  
  // Intersecciones con ejes
  constraintMatrix.forEach(constraint => {
    if (constraint.coeffs[0] !== 0) {
      const x = constraint.rhs / constraint.coeffs[0];
      if (x >= 0 && isFeasible(x, 0, constraintMatrix)) {
        vertices.push([x, 0]);
      }
    }
    if (constraint.coeffs[1] !== 0) {
      const y = constraint.rhs / constraint.coeffs[1];
      if (y >= 0 && isFeasible(0, y, constraintMatrix)) {
        vertices.push([0, y]);
      }
    }
  });

  // Intersecciones entre restricciones
  for (let i = 0; i < constraintMatrix.length; i++) {
    for (let j = i + 1; j < constraintMatrix.length; j++) {
      const intersection = findIntersection(constraintMatrix[i], constraintMatrix[j]);
      if (intersection && intersection[0] >= 0 && intersection[1] >= 0) {
        if (isFeasible(intersection[0], intersection[1], constraintMatrix)) {
          vertices.push(intersection);
        }
      }
    }
  }

  // Eliminar duplicados
  const uniqueVertices = vertices.filter((vertex, index) => {
    return !vertices.slice(0, index).some(v => 
      Math.abs(v[0] - vertex[0]) < 0.001 && Math.abs(v[1] - vertex[1]) < 0.001
    );
  });

  // Ordenar vértices en sentido horario para formar el polígono
  const sortedVertices = sortVerticesClockwise(uniqueVertices);

  // Evaluar función objetivo en vértices factibles
  let bestPoint = [0, 0];
  let bestValue = objective === "max" ? -Infinity : Infinity;

  uniqueVertices.forEach(point => {
    const [x, y] = point;
    const value = objectiveCoeffs[0] * x + objectiveCoeffs[1] * y;
    if (objective === "max" ? value > bestValue : value < bestValue) {
      bestValue = value;
      bestPoint = point;
    }
  });

  // Generar puntos para la región factible
  const feasibleRegion = [];
  for (let x = 0; x <= maxX; x += 0.2) {
    for (let y = 0; y <= maxY; y += 0.2) {
      if (isFeasible(x, y, constraintMatrix)) {
        feasibleRegion.push({ x, y });
      }
    }
  }

  return {
    optimalPoint: bestPoint,
    optimalValue: bestValue,
    vertices: uniqueVertices,
    sortedVertices,
    constraintLines,
    feasibleRegion,
    maxX,
    maxY,
    steps: [
      "1. Graficar las restricciones en el plano cartesiano",
      "2. Identificar la región factible",
      "3. Encontrar los vértices de la región factible",
      "4. Evaluar la función objetivo en cada vértice",
      "5. Seleccionar el punto que optimiza la función objetivo"
    ]
  };
};

// Función para ordenar vértices en sentido horario
const sortVerticesClockwise = (vertices: number[][]) => {
  if (vertices.length <= 2) return vertices;
  
  // Encontrar el centroide
  const centroid = vertices.reduce(
    (acc, vertex) => [acc[0] + vertex[0], acc[1] + vertex[1]], 
    [0, 0]
  ).map(sum => sum / vertices.length);

  // Ordenar por ángulo respecto al centroide
  return vertices.sort((a, b) => {
    const angleA = Math.atan2(a[1] - centroid[1], a[0] - centroid[0]);
    const angleB = Math.atan2(b[1] - centroid[1], b[0] - centroid[0]);
    return angleA - angleB;
  });
};

const findIntersection = (constraint1: ConstraintMatrix, constraint2: ConstraintMatrix): number[] | null => {
  const [a1, b1] = constraint1.coeffs;
  const [a2, b2] = constraint2.coeffs;
  const c1 = constraint1.rhs;
  const c2 = constraint2.rhs;

  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 0.001) return null; // Líneas paralelas

  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;

  return [x, y];
};

const isFeasible = (x: number, y: number, constraintMatrix: ConstraintMatrix[]): boolean => {
  if (x < 0 || y < 0) return false;
  
  return constraintMatrix.every(constraint => {
    const lhs = constraint.coeffs[0] * x + constraint.coeffs[1] * y;
    switch (constraint.type) {
      case "<=": return lhs <= constraint.rhs + 0.001;
      case ">=": return lhs >= constraint.rhs - 0.001;
      case "=": return Math.abs(lhs - constraint.rhs) < 0.001;
      default: return true;
    }
  });
};
