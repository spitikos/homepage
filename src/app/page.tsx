import { CpuStats } from "@/components/stats/cpu";

export default function Home() {
  return (
    <main className="min-h-screen p-5">
      <h1 className="text-3xl font-bold mb-4">Raspberry Pi Stats</h1>

      <CpuStats />
    </main>
  );
}
