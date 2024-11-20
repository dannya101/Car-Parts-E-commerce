import Image from "next/image";
import { SelectScrollable } from "@/components/selectbutton";


export default function Home() {
  const picConfigs = 'absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-96 fade-background animate-fade-in';
  return (
    <div className="">
      <div style={{position : "fixed"}} className={`${picConfigs}`}/>
      <div style={{position : "fixed"}} className={`${picConfigs} delay-2000`}/>
      <div style={{position : "fixed"}} className={`${picConfigs} delay-4000`}/>
      <div className="relative z-10 p-8">
        <h1 className="text-white text-5xl text-border font-bold flex justify-center">Home Page</h1>
      </div>
      <div className="relative z-10 flex flex-row items-center space-x-40 pt-28 pl-96">
        <SelectScrollable/>
        <SelectScrollable/>
      </div>
    </div>
  );
}
