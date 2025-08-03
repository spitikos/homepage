import { CpuStats } from "@/components/CpuStats";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Raspberry Pi Stats</h1>
      </div>

      <div className="mt-12">
        <CpuStats />
      </div>
    </main>
  );
}
