import Image from "next/image";
import { SelectScrollable} from "@/components/search/selectbutton";
import { SelectScrollableResult } from "@/components/search/selectresult";
import {Searchbutton} from "@/components/search/searchbutton"
import HomeButton from "@/components/search/homeButton";

export default function Home() {
  const picConfigs = 'absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-96 fade-background animate-fade-in border-solid border-2';
  //TODO add theme provider from shadcn
  //shipixen.com: website provides visual examples of using shadcn component
  //download prettier, add functions from prettier to package.json file
    //for prettier.ignore add build and coverge
  //shadcnformbuild vercel ap
  


  return (
    <div className="">
      <div style={{position : "fixed"}} className={`${picConfigs}`}/>
      <div style={{position : "fixed"}} className={`${picConfigs} delay-2000`}/>
      <div style={{position : "fixed"}} className={`${picConfigs} delay-4000`}/>
      <div className="relative z-1 p-8 flex flex-col justify-center items-center space-y-8">
        {/* <h1 className="text-white text-5xl text-border font-bold flex justify-center">Pitstop Performance</h1> */}
        <img src="/webname.svg" alt="logo" width={600} height={309}/>
        <div className="" ><HomeButton/></div>
      </div>
      
      
      <div className="relative z-10 flex flex-row justify-center items-center space-x-40 select-none">
        <SelectScrollable/>
      </div>
    </div>
  );
}
