import Image from "next/image";
import { SelectScrollable } from "@/components/selectbutton";


export default function Home() {
  return (

    <div className="relative min-h-screen">
        <div className="absolute top-1/2 right-20 w-96 h-96 fade-background animate-fade-in"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 fade-background animate-fade-in delay-2000"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 fade-background animate-fade-in delay-4000"></div>
      <div className="relative z-10 p-8">
        <h1 className="text-white text-5xl text-border font-bold flex justify-center">Home Page</h1>
      </div>
      <div className="relative top-1/3 z-10">
        <SelectScrollable/>
      </div>
      <div className="top-1/3">
        <SelectScrollable/>
      </div>
    </div>
  );
}
