import { db } from "@/integrations/firebase/client";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";

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

const INITIAL_SEED_POSTS: Omit<BlogPost, "id">[] = [
  {
    slug: "maize-prices-rise-techiman",
    title: "Maize prices climb 4% at Techiman as harvest slows",
    excerpt: "A cool spell across Bono East has slowed maize drying, tightening supply at Techiman market and pushing the 100kg bag to GH₵ 620.",
    content: `Traders at Techiman market reported a 4.2% week-on-week rise in the price of a 100kg bag of maize, now selling at GH₵ 620.\n\nField officers say the cool nights across Bono East have slowed drying at farm level, thinning what usually arrives in bulk on Wednesdays. Aggregators travelling from Kumasi and Accra have had to bid higher to secure stock.\n\n"Farmers who dried early are getting the best price this week," said Ama, an AgriFarm officer at Techiman. "We are encouraging farmers within 40km to check the price before travelling."\n\nAgriFarm will continue to track daily quotes and publish morning updates via SMS.`,
    cover_image_url: null,
    author_id: null,
    published: true,
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    slug: "sms-alerts-launch",
    title: "SMS price alerts now live for every farmer",
    excerpt: "You can now text a crop name to our shortcode and receive today's price from the nearest tracked market — no internet required.",
    content: `Starting this week, farmers on any phone in Ghana can text a crop name (for example "PRICE MAIZE") to the AgriFarm shortcode and receive today's price from the nearest tracked market by SMS.\n\nThe service uses Africa's Talking and is free to end users during the pilot. It supports maize, tomato, cassava, yam, plantain, and pepper to start; more crops are being added as officers onboard.\n\nWe designed the SMS flow for the reality of farming: patchy data, shared phones, and a need for a straight answer before deciding whether to travel.`,
    cover_image_url: null,
    author_id: null,
    published: true,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    slug: "officer-network-grows",
    title: "Officer network expands to eight markets",
    excerpt: "AgriFarm officers now cover Agbogbloshie, Kaneshie, Makola, Kejetia, Techiman, Tamale Central, Ho Central, and Takoradi Market Circle.",
    content: `AgriFarm's field-officer network has grown to eight markets across five regions. Each officer records daily prices for tracked crops, and submissions are cross-checked before publishing to filter out clerical errors and rumours.\n\nOur next markets are Wa and Bolgatanga, targeted for the next planting season. If you know a market that should be on our map, tell your officer or email the team.`,
    cover_image_url: null,
    author_id: null,
    published: true,
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
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
  try {
    const postsRef = collection(db, "blog_posts");
    const q = query(postsRef, where("published", "==", true));
    const snap = await getDocs(q);
    if (snap.empty) {
      return INITIAL_SEED_POSTS.map((p, idx) => ({ id: `seed-${idx}`, ...p }));
    }
    const list: BlogPost[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() } as BlogPost));
    return list.sort((a, b) => ((b.published_at || "") > (a.published_at || "") ? 1 : -1));
  } catch {
    return INITIAL_SEED_POSTS.map((p, idx) => ({ id: `seed-${idx}`, ...p }));
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const postsRef = collection(db, "blog_posts");
    const q = query(postsRef, where("slug", "==", slug), where("published", "==", true));
    const snap = await getDocs(q);
    if (snap.empty) {
      const foundSeed = INITIAL_SEED_POSTS.find((p) => p.slug === slug);
      return foundSeed ? { id: "seed-item", ...foundSeed } : null;
    }
    const docData = snap.docs[0];
    return { id: docData.id, ...docData.data() } as BlogPost;
  } catch {
    const foundSeed = INITIAL_SEED_POSTS.find((p) => p.slug === slug);
    return foundSeed ? { id: "seed-item", ...foundSeed } : null;
  }
}

export async function listAllPostsForAdmin(): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, "blog_posts");
    const snap = await getDocs(postsRef);
    if (snap.empty) {
      return INITIAL_SEED_POSTS.map((p, idx) => ({ id: `seed-${idx}`, ...p }));
    }
    const list: BlogPost[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() } as BlogPost));
    return list.sort((a, b) => ((b.created_at || "") > (a.created_at || "") ? 1 : -1));
  } catch {
    return INITIAL_SEED_POSTS.map((p, idx) => ({ id: `seed-${idx}`, ...p }));
  }
}

export async function togglePublishPost(id: string, published: boolean): Promise<void> {
  const published_at = published ? new Date().toISOString() : null;
  const postRef = doc(db, "blog_posts", id);
  await updateDoc(postRef, { published, published_at, updated_at: new Date().toISOString() });
}

export async function deleteBlogPost(id: string): Promise<void> {
  const postRef = doc(db, "blog_posts", id);
  await deleteDoc(postRef);
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
    updated_at: new Date().toISOString(),
  };

  if (post.id && !post.id.startsWith("seed-")) {
    const postRef = doc(db, "blog_posts", post.id);
    await updateDoc(postRef, payload);
  } else {
    await addDoc(collection(db, "blog_posts"), {
      ...payload,
      created_at: new Date().toISOString(),
    });
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

