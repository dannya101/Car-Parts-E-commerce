import * as React from "react"
import {useState, useEffect} from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Model {
  id: number;
  model_name: string;
  brand_id: number;
}

interface SelectScrollableResultProps {
  selectedBrandName: string;
  selectedBrandId: number;
  onModelSelect: (model: string) => void;
}

export function SelectScrollableResult({
  selectedBrandName,
  selectedBrandId,
  onModelSelect,
}: SelectScrollableResultProps) {
  const [models, setModels] = React.useState<Model[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8000/product/modelcategories/?brand_id=${selectedBrandId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.statusText}`);
        }
        const data: Model[] = await response.json();
        console.log("Fetched models:", data); // Debugging log
        setModels(data || []);
      } catch (error) {
        console.error("Error fetching models:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [selectedBrandId]);

  if (loading) return <div>Loading models...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Select onValueChange={onModelSelect}>
      <SelectTrigger className="w-[150px] bg-white border-solid border-2 border-black">
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent>
        {models.length > 0 ? (
          models.map((model) => (
            <SelectItem key={model.id} value={model.id.toString()}>
              {model.model_name}
            </SelectItem>
          ))
        ) : (
          <div className="text-center py-2">No models available</div>
        )}
      </SelectContent>
    </Select>
  );
}