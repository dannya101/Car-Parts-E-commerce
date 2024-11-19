import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 fade-background"></div>
      <div className="absolute inset-0 fade-background delay-2000"></div>
      <div className="absolute inset-0 fade-background delay-4000"></div>

      <div className="relative z-10 p-8">
        <h1 className="text-white text-5xl text-border font-bold flex justify-center">Home Page</h1>
      </div>
    </div>
  );
}
