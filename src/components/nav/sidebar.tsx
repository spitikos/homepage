import { Highlight } from "@/components/highlight";
import { IconCpu } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const navData = [
  {
    link: "/stats",
    icon: IconCpu,
  },
];

const Sidebar = () => {
  return (
    <nav className="fixed top-0 left-0 w-16 h-svh border-r flex flex-col py-1 items-center gap-3">
      <Link href="/" className="relative rounded overflow-hidden size-8">
        <Image
          src="/logo.svg"
          alt="logo"
          width={32}
          height={32}
          className="absolute -z-100"
        />
      </Link>
      {navData.map((item) => (
        <Highlight key={item.link}>
          <Link
            href={item.link}
            className="size-12 flex items-center justify-center"
          >
            <item.icon />
          </Link>
        </Highlight>
      ))}
    </nav>
  );
};

export default Sidebar;
