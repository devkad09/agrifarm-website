import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_id: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogCategory = "All" | "Market Trends" | "Farming Guides" | "Field Reports" | "SMS & Tech";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "All",
  "Market Trends",
  "Farming Guides",
  "Field Reports",
  "SMS & Tech",
];

export function getPostCategory(post: BlogPost): Exclude<BlogCategory, "All"> {
  const text = `${post.title} ${post.excerpt || ""} ${post.content}`.toLowerCase();
  if (text.includes("sms") || text.includes("alert") || text.includes("app") || text.includes("phone") || text.includes("tech")) {
    return "SMS & Tech";
  }
  if (text.includes("price") || text.includes("trend") || text.includes("wholesale") || text.includes("market") || text.includes("cost") || text.includes("cedi") || text.includes("bag")) {
    return "Market Trends";
  }
  if (text.includes("report") || text.includes("techiman") || text.includes("tamale") || text.includes("kumasi") || text.includes("accra") || text.includes("officer") || text.includes("field")) {
    return "Field Reports";
  }
  return "Farming Guides";
}

export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function listPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return (data as BlogPost | null) ?? null;
}

export async function listAllPostsForAdmin(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function togglePublishPost(id: string, published: boolean): Promise<void> {
  const published_at = published ? new Date().toISOString() : null;
  const { error } = await supabase
    .from("blog_posts")
    .update({ published, published_at })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertBlogPost(post: {
  id?: string | null;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  published: boolean;
  author_id?: string | null;
}): Promise<void> {
  const payload = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || null,
    content: post.content,
    cover_image_url: post.cover_image_url || null,
    published: post.published,
    author_id: post.author_id || null,
    published_at: post.published ? new Date().toISOString() : null,
  };

  if (post.id) {
    const { error } = await supabase
      .from("blog_posts")
      .update(payload)
      .eq("id", post.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("blog_posts").insert(payload);
    if (error) throw error;
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
