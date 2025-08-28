import { DocsService } from "@/lib/api/proto";
import { transport } from "@/lib/api/server";
import "@/styles/article.css";
import { createClient } from "@connectrpc/connect";
import { MarkdownAsync } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export const revalidate = 3600; /* 1 hour */

type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;

  const client = createClient(DocsService, transport);

  const { doc } = await client.getDoc({ slug: slug.join("/") });

  return (
    <article>
      <MarkdownAsync remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {doc?.content}
      </MarkdownAsync>
    </article>
  );
};

export default Page;

export const generateStaticParams = async () => {
  const client = createClient(DocsService, transport);
  const { slugs } = await client.getSlugs({});

  return slugs.map((slug) => ({ slug: slug.split("/") }));
};
