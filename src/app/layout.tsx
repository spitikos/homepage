import { Header } from "@/components/nav";
import { Providers } from "@/components/providers";
import { Metadata } from "next";
import { ReactNode } from "react";
import { ppNeueMontreal, ppNeueMontrealMono } from "./_fonts/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "PI",
  description: "Ethan's Kubernetes Homelab on Raspberry Pi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ppNeueMontreal.variable} ${ppNeueMontrealMono.variable} antialiased [&_main]:min-h-svh [&_main]:pt-12`}
      >
        <Providers>
          <div className="bg-noise" />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
