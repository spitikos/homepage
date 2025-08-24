"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const Header = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").slice(1);

  return (
    <header className="fixed top-0 left-0 w-svw flex items-center px-5 h-12 text-sm border-b">
      <div className="flex">
        <Link href="/">SPITIKOS</Link>
        {paths.map((path, i) => (
          <Fragment key={i}>
            <span className="mx-2 text-secondary">/</span>
            <Link href={`/${path}`}>{path.toUpperCase()}</Link>
          </Fragment>
        ))}
      </div>
    </header>
  );
};

export default Header;
