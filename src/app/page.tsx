"use client";

import { Highlight } from "@/components/highlight";
import dynamic from "next/dynamic";
import Link from "next/link";

const AsciiGrid = dynamic(
  () => import("@/components/interactions").then((mod) => mod.AsciiGrid),
  { ssr: false },
);

const navData = [
  {
    link: "/stats",
    label: "STATS",
  },
  {
    link: "/wiki",
    label: "WIKI",
  },
];

export default function Home() {
  return (
    <main className="h-svh overflow-hidden">
      <AsciiGrid />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-20">
        <div className="pointer-events-none size-full text-center">
          <p>PROJECT</p>
          <h1 className="text-9xl font-sans font-black tracking-tighter">
            SPITIKOS
          </h1>
          <p>BY ETHAN LEE</p>
        </div>

        <div className="">
          {navData.map((item) => (
            <Highlight key={item.link}>
              <Link
                href={item.link}
                className="w-full flex items-center px-4 py-3 leading-none relative before:absolute before:h-5 before:w-0.5 before:bg-primary before:top-1/2 before:-translate-y-1/2 before:left-0 hover:before:w-1 before:transition-all"
              >
                {item.label}
              </Link>
            </Highlight>
          ))}
        </div>
      </div>
    </main>
  );
}
