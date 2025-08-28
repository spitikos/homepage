import { SiteHeader } from "@/components/nav";
import { Providers } from "@/components/providers";
import { ppNeueMontreal, ppNeueMontrealMono } from "@/lib/fonts";
import "@/styles/globals.css";
import { type Metadata } from "next";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "spitikos",
  description: "k8s at home",
};

type LayoutProps = {
  children: Readonly<ReactNode>;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${ppNeueMontreal.variable} ${ppNeueMontrealMono.variable} antialiased [&_main]:min-h-svh [&_main]:pt-12 overflow-x-hidden relative bg-noise`}
      >
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
