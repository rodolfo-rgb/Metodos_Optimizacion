interface SolutionStepsProps {
  steps: string[];
}

const SolutionSteps = ({ steps }: SolutionStepsProps) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">Pasos de Solución</h3>
      <ol className="list-decimal list-inside space-y-1 text-sm">
        {steps.map((step, index) => (
          <li key={index} className="text-gray-700">{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default SolutionSteps;
