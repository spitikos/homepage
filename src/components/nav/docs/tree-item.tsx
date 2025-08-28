"use client";

import { Highlight } from "@/components/highlight";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SlugTree = {
  name: string;
  path: string;
  children: SlugTree[];
};

type TreeItemProps = {
  tree: SlugTree | null;
};
const TreeItem = ({ tree }: TreeItemProps) => {
  const pathname = usePathname();

  if (!tree) return null;

  const isLeaf = tree.children.length === 0;
  const link = `/docs/${tree.path}`;

  return (
    <div className="flex flex-col">
      {isLeaf ? (
        <Highlight>
          <Link
            href={link}
            className={cn(
              "highlight-border-l py-2 pl-4",
              pathname === link && "before:bg-primary before:w-1",
            )}
          >
            {tree.name.toUpperCase()}
          </Link>
        </Highlight>
      ) : (
        <span className="text-secondary py-1">{tree.name.toUpperCase()}</span>
      )}

      {tree.children.map((child, i) => (
        <TreeItem key={i} tree={child} />
      ))}
    </div>
  );
};

export default TreeItem;
