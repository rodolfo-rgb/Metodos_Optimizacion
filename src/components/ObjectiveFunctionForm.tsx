import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ObjectiveFunctionFormProps {
  objective: string;
  c1: string;
  c2: string;
  onObjectiveChange: (value: string) => void;
  onC1Change: (value: string) => void;
  onC2Change: (value: string) => void;
}

const ObjectiveFunctionForm = ({
  objective,
  c1,
  c2,
  onObjectiveChange,
  onC1Change,
  onC2Change
}: ObjectiveFunctionFormProps) => {
  return (
    <div>
      <Label className="text-base font-semibold">Función Objetivo</Label>
      <div className="flex items-center space-x-2 mt-2">
        <Select value={objective} onValueChange={onObjectiveChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="max">Max</SelectItem>
            <SelectItem value="min">Min</SelectItem>
          </SelectContent>
        </Select>
        <span>Z =</span>
        <Input
          type="number"
          placeholder="c₁"
          value={c1}
          onChange={(e) => onC1Change(e.target.value)}
          className="w-20"
        />
        <span>x₁ +</span>
        <Input
          type="number"
          placeholder="c₂"
          value={c2}
          onChange={(e) => onC2Change(e.target.value)}
          className="w-20"
        />
        <span>x₂</span>
      </div>
    </div>
  );
};

export default ObjectiveFunctionForm;
