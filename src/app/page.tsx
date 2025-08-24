"use client";

import dynamic from "next/dynamic";

const AsciiGrid = dynamic(
  () => import("@/components/interactions").then((mod) => mod.AsciiGrid),
  { ssr: false },
);

export default function Home() {
  return (
    <main className="h-svh overflow-hidden">
      <AsciiGrid />
      <div className="absolute pointer-events-none pt-12 pl-16 left-0 top-0 size-full flex flex-col items-center justify-center">
        <p>PROJECT</p>
        <h1 className="text-9xl font-sans font-black tracking-tighter">
          SPITIKOS
        </h1>
        <p>BY ETHAN LEE</p>
      </div>
    </main>
  );
}
