import { DocsSidebar } from "@/components/nav";
import { type ReactNode } from "react";

type LayoutProps = {
  children: Readonly<ReactNode>;
};
const Layout = async ({ children }: LayoutProps) => {
  return (
    <main>
      <DocsSidebar />
      <div className="pl-[300px] py-20 container mx-auto">{children}</div>
    </main>
  );
};

export default Layout;
