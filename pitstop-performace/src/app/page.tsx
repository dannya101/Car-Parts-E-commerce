import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 fade-background"></div>
      <div className="absolute inset-0 fade-background delay-2000"></div>
      <div className="absolute inset-0 fade-background delay-4000"></div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative z-10 p-8">
        <h1 className="text-white text-5xl text-border font-bold flex justify-center">Home Page</h1>
      </div>
    </div>
  );
}
