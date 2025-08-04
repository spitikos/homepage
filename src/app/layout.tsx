import { Header } from "@/components/nav";
import type { Metadata } from "next";
import { ppNeueMontreal, ppNeueMontrealMono } from "./_fonts/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "PI",
  description: "Ethan's Kubernetes Homelab on Raspberry Pi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ppNeueMontreal.variable} ${ppNeueMontrealMono.variable} antialiased min-h-svh`}
      >
        <div className="bg-noise" />
        <Header />
        <main className="pt-12">{children}</main>
      </body>
    </html>
  );
}
