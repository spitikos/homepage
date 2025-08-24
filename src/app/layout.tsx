import { Nav } from "@/components/nav";
import { Providers } from "@/components/providers";
import { ppNeueMontreal, ppNeueMontrealMono } from "@/lib/fonts";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "spitikos",
  description: "k8s at home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ppNeueMontreal.variable} ${ppNeueMontrealMono.variable} antialiased [&_main]:min-h-svh [&_main]:pt-12 overflow-x-hidden`}
      >
        <Providers>
          <div className="bg-noise fixed size-full top-0 left-0" />
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
