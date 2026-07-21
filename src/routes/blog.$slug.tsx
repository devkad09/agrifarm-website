import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getPostBySlug } from "@/lib/blog";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCanonicalUrl, DEFAULT_OG_IMAGE, buildBlogPostSchema } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [{ title: "Post · AgriFarm" }] };
    const canonical = getCanonicalUrl(`/blog/${p.slug}`);
    const ogImage = p.cover_image_url || DEFAULT_OG_IMAGE;
    const description = p.excerpt || p.content.slice(0, 160).replace(/\n/g, " ");

    return {
      meta: [
        { title: `${p.title} | AgriFarm Journal` },
        { name: "description", content: description },
        { property: "og:title", content: p.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: ogImage },
        { property: "article:published_time", content: p.published_at || p.created_at },
        { property: "article:author", content: "AgriFarm Field Officers" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: BlogPost,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="text-center">
        <p className="font-display text-3xl font-semibold">Post not found</p>
        <Link to="/blog" className="mt-4 inline-block text-primary underline">Back to all posts</Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="text-center">
        <p className="font-display text-2xl font-semibold">This post failed to load</p>
        <Link to="/blog" className="mt-4 inline-block text-primary underline">Back to all posts</Link>
      </div>
    </div>
  ),
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { post: initial } = Route.useLoaderData();
  const { data: post } = useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () => getPostBySlug(slug),
    initialData: initial,
  });

  if (!post) return null;

  const postSchema = buildBlogPostSchema(post);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <article className="container-page max-w-3xl py-16">
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">← All posts</Link>
          <p className="mt-8 text-sm text-primary font-medium uppercase tracking-widest">AgriFarm journal</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold leading-tight">{post.title}</h1>
          {post.published_at && (
            <p className="mt-4 text-sm text-muted-foreground">
              Published {new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
          {post.cover_image_url && (
            <img src={post.cover_image_url} alt="" className="mt-8 rounded-2xl w-full h-auto object-cover" />
          )}
          <div className="mt-10 prose prose-lg max-w-none whitespace-pre-wrap font-sans text-foreground leading-relaxed">
            {post.content}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
