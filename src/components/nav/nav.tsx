"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const Header = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").slice(1);

  return (
    <header className="fixed top-0 left-0 flex items-center px-5 py-4">
      <span className="leading-none">
        <Link href="/">PI</Link>
        {paths.map((path, i) => (
          <Fragment key={i}>
            <span className="mx-2 text-secondary">/</span>
            <Link href={`/${path}`}>{path.toUpperCase()}</Link>
          </Fragment>
        ))}
      </span>
    </header>
  );
};

export default Header;
