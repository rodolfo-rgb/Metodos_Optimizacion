import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Constraint {
  a1: string;
  a2: string;
  type: string;
  b: string;
}

interface ConstraintsFormProps {
  constraints: Constraint[];
  onAddConstraint: () => void;
  onUpdateConstraint: (index: number, field: string, value: string) => void;
  onRemoveConstraint: (index: number) => void;
}

const ConstraintsForm = ({
  constraints,
  onAddConstraint,
  onUpdateConstraint,
  onRemoveConstraint
}: ConstraintsFormProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-base font-semibold">Restricciones</Label>
        <Button onClick={onAddConstraint} size="sm" variant="outline">
          Agregar
        </Button>
      </div>
      
      {constraints.map((constraint, index) => (
        <div key={index} className="flex items-center space-x-2 mb-3">
          <Input
            type="number"
            placeholder="a₁"
            value={constraint.a1}
            onChange={(e) => onUpdateConstraint(index, "a1", e.target.value)}
            className="w-20"
          />
          <span>x₁ +</span>
          <Input
            type="number"
            placeholder="a₂"
            value={constraint.a2}
            onChange={(e) => onUpdateConstraint(index, "a2", e.target.value)}
            className="w-20"
          />
          <span>x₂</span>
          <Select 
            value={constraint.type} 
            onValueChange={(value) => onUpdateConstraint(index, "type", value)}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<=">&le;</SelectItem>
              <SelectItem value=">=">&ge;</SelectItem>
              <SelectItem value="=">=</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="b"
            value={constraint.b}
            onChange={(e) => onUpdateConstraint(index, "b", e.target.value)}
            className="w-20"
          />
          {constraints.length > 1 && (
            <Button
              onClick={() => onRemoveConstraint(index)}
              size="sm"
              variant="destructive"
            >
              ×
            </Button>
          )}
        </div>
      ))}
      
      <div className="text-sm text-gray-600 mt-3">
        x₁, x₂ ≥ 0 (restricciones de no negatividad)
      </div>
    </div>
  );
};

export default ConstraintsForm;