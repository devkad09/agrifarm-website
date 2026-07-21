import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  listPublishedPosts,
  getPostCategory,
  getReadingTime,
  BLOG_CATEGORIES,
  type BlogCategory,
} from "@/lib/blog";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCanonicalUrl, DEFAULT_OG_IMAGE, buildBlogSchema } from "@/lib/seo";
import { Search, X, Clock, Tag, Sparkles, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "AgriFarm Journal — Ghanaian Market Trends & Farming Insights" },
      {
        name: "description",
        content:
          "Read field reports, market price analysis, harvest updates, and farming guides from AgriFarm field officers across Ghana.",
      },
      { property: "og:title", content: "AgriFarm Journal — Market Trends & Field Notes" },
      {
        property: "og:description",
        content:
          "Field reports, price trend analysis, and agricultural updates from market officers across Ghana.",
      },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { property: "og:url", content: getCanonicalUrl("/blog") },
      { name: "twitter:title", content: "AgriFarm Journal — Ghanaian Market Trends" },
      {
        name: "twitter:description",
        content: "Field reports and market price analysis from Ghana's agricultural regions.",
      },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: getCanonicalUrl("/blog") }],
  }),
  component: BlogList,
});

function BlogList() {
  const blogSchema = buildBlogSchema();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog", "published"],
    queryFn: listPublishedPosts,
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("All");

  // Calculate category counts
  const categoryCounts: Record<BlogCategory, number> = {
    All: posts.length,
    "Market Trends": posts.filter((p) => getPostCategory(p) === "Market Trends").length,
    "Farming Guides": posts.filter((p) => getPostCategory(p) === "Farming Guides").length,
    "Field Reports": posts.filter((p) => getPostCategory(p) === "Field Reports").length,
    "SMS & Tech": posts.filter((p) => getPostCategory(p) === "SMS & Tech").length,
  };

  // Filter posts by search query and category
  const filteredPosts = posts.filter((p) => {
    const category = getPostCategory(p);
    const matchesCategory = selectedCategory === "All" || category === selectedCategory;

    const textToSearch = `${p.title} ${p.excerpt || ""} ${p.content} ${category}`.toLowerCase();
    const matchesSearch =
      search.trim() === "" || textToSearch.includes(search.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const isFiltered = search.trim() !== "" || selectedCategory !== "All";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <SiteHeader />
      <main className="flex-1 container-page py-12 lg:py-16">
        {/* Header section */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5" /> The AgriFarm Journal
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">
            News from the fields and markets.
          </h1>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed">
            Field notes from our market officers across Ghana, regional price trend analysis, harvest updates, and practical guides for farmers.
          </p>
        </div>

        {/* Search & Category Filter Control Bar */}
        <div className="mt-10 p-6 rounded-2xl border border-border bg-card shadow-xs space-y-5">
          <div className="grid md:grid-cols-12 gap-4 items-center">
            {/* Search Input Bar */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by crop, market, or keyword…"
                className="w-full rounded-full border border-border bg-background pl-10 pr-10 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground transition"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Summary Counter */}
            <div className="md:col-span-6 flex items-center justify-start md:justify-end gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-medium">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Showing {filteredPosts.length} of {posts.length} articles
              </span>
              {isFiltered && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
            {BLOG_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = categoryCounts[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-secondary/80 hover:bg-secondary text-secondary-foreground"
                  }`}
                >
                  {cat}
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background/80 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="mt-10">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground font-medium">Loading articles…</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            /* Empty State */
            <div className="py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50 max-w-lg mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold">No articles found</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {search
                  ? `No articles matched "${search}"${
                      selectedCategory !== "All" ? ` under ${selectedCategory}` : ""
                    }.`
                  : `No articles in ${selectedCategory} yet.`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-xs font-medium hover:opacity-90 transition"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            /* Cards List */
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((p) => {
                const category = getPostCategory(p);
                const readTime = getReadingTime(p.content);
                return (
                  <li key={p.id}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="group flex flex-col h-full rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg hover:border-primary/40"
                    >
                      {/* Image Thumbnail */}
                      {p.cover_image_url ? (
                        <div className="mb-4 aspect-[16/10] w-full rounded-xl overflow-hidden bg-muted">
                          <img
                            src={p.cover_image_url}
                            alt=""
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="mb-4 aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-emerald-500/20 flex items-center justify-center">
                          <Tag className="h-8 w-8 text-primary/40" />
                        </div>
                      )}

                      {/* Tags & Meta Row */}
                      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-[11px]">
                          {category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <Clock className="h-3 w-3" /> {readTime} min read
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="mt-1 font-display text-xl font-semibold group-hover:text-primary transition leading-snug">
                        {p.title}
                      </h2>

                      {/* Excerpt */}
                      {p.excerpt && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                          {p.excerpt}
                        </p>
                      )}

                      {/* Footer Info */}
                      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {p.published_at
                            ? new Date(p.published_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : ""}
                        </span>
                        <span className="font-medium text-primary group-hover:translate-x-0.5 transition inline-flex items-center gap-0.5">
                          Read article →
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
