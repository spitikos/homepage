import { transport } from "@/lib/api/server";
import { DocsService } from "@buf/spitikos_api.bufbuild_es/docs/docs_pb";
import { createClient } from "@connectrpc/connect";
import TreeItem, { type SlugTree } from "./tree-item";

const DocsSidebar = async () => {
  const client = createClient(DocsService, transport);

  const { slugs } = await client.getSlugs({});

  const tree: SlugTree = {
    name: "",
    path: "/",
    children: [],
  };

  for (const slug of slugs) {
    const parts = slug.split("/");
    let current = tree;
    parts.forEach((part, i) => {
      let child = current.children.find((ch) => ch.name === part);
      if (!child) {
        child = {
          name: part,
          path: parts.slice(0, i + 1).join("/"),
          children: [],
        };
        current.children.push(child);
      }
      current = child;
    });
  }

  return (
    <aside className="fixed left-0 top-0 pt-12 h-svh w-[300px] border-r">
      <div className="p-5 flex flex-col gap-4 **:w-full **:leading-none">
        {tree.children.map((child, i) => (
          <TreeItem key={i} tree={child} />
        ))}
      </div>
    </aside>
  );
};

export default DocsSidebar;
