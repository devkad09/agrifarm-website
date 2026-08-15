import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auth, db } from "@/integrations/firebase/client";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import {
  listAllPostsForAdmin,
  togglePublishPost,
  deleteBlogPost,
  upsertBlogPost,
  slugify,
  type BlogPost,
} from "@/lib/blog";
import { SiteHeader } from "@/components/site-header";
import { AdminPriceBroadcaster } from "@/components/admin-price-broadcaster";
import { toast } from "sonner";
import { z } from "zod";
import {
  FileText,
  Eye,
  Edit3,
  Trash2,
  Globe,
  FileMinus,
  Plus,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  Bold,
  Italic,
  List as ListIcon,
  Heading as HeadingIcon,
  Quote,
  Lock,
  Unlock,
  AlertTriangle,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Journal Admin Editor · AgriFarm" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const postSchema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(140),
  slug:
    z.string()
    .trim()
    .min(3, "Slug is too short")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().trim().max(400).optional(),
  content: z.string().trim().min(10, "Post content must be at least 10 characters").max(30000),
  cover_image_url: z.string().trim().url("Must be a valid image URL").optional().or(z.literal("")),
  published: z.boolean(),
});

const IMAGE_PRESETS = [
  {
    name: "Maize Harvest",
    url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Fresh Tomatoes",
    url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Busy Market",
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Farming Field",
    url: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80",
  },
];

function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setIsAdmin(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", u.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Verifying admin credentials…</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 grid place-items-center px-4 py-16">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="font-display text-3xl font-semibold">Admin access required</h1>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Your account does not have administrator privileges to manage the AgriFarm blog. Contact your system admin if you believe this is an error.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
              Return to Homepage
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-page py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold">Journal Admin Editor</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> Admin
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Create, edit, draft, publish, and delete posts for AgriFarm News & Insights.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/blog"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-accent transition"
            >
              <Globe className="h-3.5 w-3.5" /> View Live Blog
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>
            <button
              onClick={() => firebaseSignOut(auth).then(() => navigate({ to: "/" }))}
              className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="my-8">
          <AdminPriceBroadcaster />
        </div>

        <AdminContent />
      </main>
    </div>
  );
}

function emptyDraft(): BlogPostFormState {
  return {
    id: null,
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    published: false,
    autoSlug: true,
  };
}

interface BlogPostFormState {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  published: boolean;
  autoSlug: boolean;
}

function AdminContent() {
  const qc = useQueryClient();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog", "admin"],
    queryFn: listAllPostsForAdmin,
  });

  const [draft, setDraft] = useState<BlogPostFormState>(emptyDraft());
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);

  // Stats calculation
  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  // Filtered posts calculation
  const filteredPosts = posts.filter((p) => {
    const matchesFilter =
      filter === "all" ? true : filter === "published" ? p.published : !p.published;
    const matchesSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Toggle publish mutation
  const togglePublishMut = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      await togglePublishPost(id, published);
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["blog"] });
      toast.success(variables.published ? "Post published live!" : "Post reverted to draft.");
      if (draft.id === variables.id) {
        setDraft((d) => ({ ...d, published: variables.published }));
      }
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to change post status");
    },
  });

  // Delete mutation
  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      await deleteBlogPost(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog"] });
      toast.success("Post deleted successfully.");
      if (draft.id === deletingPost?.id) {
        setDraft(emptyDraft());
      }
      setDeletingPost(null);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete post");
      setDeletingPost(null);
    },
  });

  function startEdit(p: BlogPost) {
    setDraft({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? "",
      content: p.content,
      cover_image_url: p.cover_image_url ?? "",
      published: p.published,
      autoSlug: false,
    });
    setActiveTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleTitleChange(newTitle: string) {
    setDraft((d) => ({
      ...d,
      title: newTitle,
      slug: d.autoSlug || !d.slug ? slugify(newTitle) : d.slug,
    }));
  }

  function insertFormatting(prefix: string, suffix: string = "") {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = draft.content.substring(start, end) || "text";
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = draft.content.substring(0, start) + replacement + draft.content.substring(end);
    setDraft((d) => ({ ...d, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  }

  async function handleSave(asPublished: boolean) {
    const slugToUse = draft.slug.trim() || slugify(draft.title);
    const parsed = postSchema.safeParse({
      title: draft.title,
      slug: slugToUse,
      excerpt: draft.excerpt || undefined,
      content: draft.content,
      cover_image_url: draft.cover_image_url || undefined,
      published: asPublished,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSaving(true);
    try {
      const currentUser = auth.currentUser;
      await upsertBlogPost({
        id: draft.id,
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        cover_image_url: parsed.data.cover_image_url,
        published: asPublished,
        author_id: currentUser?.uid,
      });

      qc.invalidateQueries({ queryKey: ["blog"] });
      toast.success(
        draft.id
          ? asPublished
            ? "Post updated and published!"
            : "Draft changes saved."
          : asPublished
            ? "New post published!"
            : "Saved as draft."
      );
      setDraft(emptyDraft());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  // Word count & reading time estimate
  const wordCount = draft.content.trim() ? draft.content.trim().split(/\s+/).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="mt-8 space-y-8">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Posts</p>
            <p className="font-display text-3xl font-bold mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Published Live</p>
            <p className="font-display text-3xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{publishedCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Globe className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Drafts</p>
            <p className="font-display text-3xl font-bold mt-1 text-amber-600 dark:text-amber-400">{draftCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Editor & Posts Manager */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Editor Column (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">
                {draft.id ? "Edit Post" : "Create New Post"}
              </h2>
              {draft.id && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded-md font-mono text-muted-foreground">
                  ID: {draft.id.slice(0, 8)}…
                </span>
              )}
            </div>

            {/* Mode Switcher: Write vs Preview */}
            <div className="flex rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  activeTab === "write"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1 ${
                  activeTab === "preview"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
            </div>
          </div>

          {activeTab === "write" ? (
            <div className="space-y-5">
              {/* Title Field */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Post Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Grain Prices Rise Across Northern Ghana Markets"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>

              {/* Slug Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-muted-foreground">
                    URL Slug <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        autoSlug: !d.autoSlug,
                        slug: !d.autoSlug ? slugify(d.title) : d.slug,
                      }))
                    }
                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                  >
                    {draft.autoSlug ? (
                      <>
                        <Lock className="h-3 w-3" /> Auto-syncing title
                      </>
                    ) : (
                      <>
                        <Unlock className="h-3 w-3" /> Manual slug mode
                      </>
                    )}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-muted-foreground font-mono select-none">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={draft.slug}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, slug: e.target.value, autoSlug: false }))
                    }
                    placeholder="grain-prices-rise-northern-ghana"
                    className="w-full rounded-xl border border-border bg-background pl-16 pr-4 py-2 text-sm font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
              </div>

              {/* Excerpt Field */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Excerpt / Summary (Optional)
                </label>
                <textarea
                  value={draft.excerpt}
                  onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                  rows={2}
                  placeholder="A short summary displayed on post cards and meta description (1-2 sentences)."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>

              {/* Cover Image Field & Sample Presets */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Cover Image URL (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={draft.cover_image_url}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, cover_image_url: e.target.value }))
                    }
                    placeholder="https://images.unsplash.com/…"
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>

                {/* Preset image suggestions */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-medium mr-1">Presets:</span>
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.name}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, cover_image_url: img.url }))}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-secondary/60 hover:bg-secondary text-[11px] font-medium transition"
                    >
                      <ImageIcon className="h-3 w-3 text-primary" /> {img.name}
                    </button>
                  ))}
                </div>

                {/* Live Cover Preview */}
                {draft.cover_image_url && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-border aspect-[21/9] bg-muted">
                    <img
                      src={draft.cover_image_url}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={() => toast.error("Cover image failed to load")}
                    />
                    <button
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, cover_image_url: "" }))}
                      className="absolute top-2 right-2 rounded-full bg-black/60 text-white p-1 hover:bg-black transition"
                      title="Remove image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Content Formatting Toolbar & Textarea */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="block text-xs font-medium text-muted-foreground">
                    Content <span className="text-destructive">*</span>
                  </label>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>~{readTimeMin} min read</span>
                  </div>
                </div>

                {/* Markdown Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-t-xl border border-b-0 border-border bg-muted/50">
                  <button
                    type="button"
                    onClick={() => insertFormatting("## ")}
                    className="p-1.5 rounded hover:bg-background text-muted-foreground hover:text-foreground transition"
                    title="Heading"
                  >
                    <HeadingIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("**", "**")}
                    className="p-1.5 rounded hover:bg-background text-muted-foreground hover:text-foreground transition"
                    title="Bold"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("*", "*")}
                    className="p-1.5 rounded hover:bg-background text-muted-foreground hover:text-foreground transition"
                    title="Italic"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("> ")}
                    className="p-1.5 rounded hover:bg-background text-muted-foreground hover:text-foreground transition"
                    title="Quote"
                  >
                    <Quote className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("- ")}
                    className="p-1.5 rounded hover:bg-background text-muted-foreground hover:text-foreground transition"
                    title="Bullet List"
                  >
                    <ListIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("[Link title](", ")")}
                    className="p-1.5 rounded hover:bg-background text-muted-foreground hover:text-foreground transition text-xs font-mono"
                    title="Link"
                  >
                    [link]
                  </button>
                </div>

                <textarea
                  id="content-textarea"
                  value={draft.content}
                  onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                  rows={14}
                  placeholder="Write post content here. Line breaks are preserved. Use ## for section titles."
                  className="w-full rounded-b-xl border border-border bg-background px-4 py-3 text-sm font-sans leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>

              {/* Action Control Buttons */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSave(false)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-xs font-medium text-foreground hover:bg-secondary transition disabled:opacity-50"
                  >
                    <Clock className="h-4 w-4 text-amber-500" />
                    {saving ? "Saving…" : "Save as Draft"}
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSave(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-xs font-medium hover:opacity-90 transition disabled:opacity-50 shadow-xs"
                  >
                    <Globe className="h-4 w-4" />
                    {saving ? "Publishing…" : draft.id ? "Publish & Save" : "Publish Live"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {draft.id && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = posts.find((p) => p.id === draft.id);
                        if (target) setDeletingPost(target);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 px-4 py-2 text-xs font-medium transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  )}
                  {(draft.id || draft.title || draft.content) && (
                    <button
                      type="button"
                      onClick={() => setDraft(emptyDraft())}
                      className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                    >
                      Clear Form
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Live Formatted Preview Tab */
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-muted/30 p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs text-primary font-medium uppercase tracking-widest">
                  <span>AgriFarm Journal</span>
                  <span>•</span>
                  <span>{draft.published ? "Live" : "Draft Preview"}</span>
                </div>
                <h1 className="font-display text-3xl font-semibold leading-tight">
                  {draft.title || "Untitled Post Title"}
                </h1>
                {draft.excerpt && (
                  <p className="text-muted-foreground text-sm leading-relaxed italic border-l-2 border-primary/40 pl-3">
                    {draft.excerpt}
                  </p>
                )}
                {draft.cover_image_url && (
                  <img
                    src={draft.cover_image_url}
                    alt=""
                    className="w-full rounded-xl aspect-[16/9] object-cover"
                  />
                )}
                <div className="mt-6 prose prose-neutral max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                  {draft.content || "No post content entered yet."}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Posts List & Management Sidebar (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Manage Posts</h2>
              <button
                type="button"
                onClick={() => setDraft(emptyDraft())}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium hover:bg-primary/20 transition"
              >
                <Plus className="h-3.5 w-3.5" /> New Post
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or slug…"
                className="w-full rounded-xl border border-border bg-background pl-9 pr-8 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex rounded-lg bg-muted p-1 text-xs">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 py-1.5 font-medium rounded-md transition ${
                  filter === "all"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setFilter("published")}
                className={`flex-1 py-1.5 font-medium rounded-md transition ${
                  filter === "published"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Live ({publishedCount})
              </button>
              <button
                onClick={() => setFilter("drafts")}
                className={`flex-1 py-1.5 font-medium rounded-md transition ${
                  filter === "drafts"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Drafts ({draftCount})
              </button>
            </div>

            {/* Posts Cards Container */}
            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Loading blog posts…
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">No posts found</p>
                  <p className="text-xs text-muted-foreground">
                    {search ? "Try adjusting your search terms." : "Create your first blog post using the editor."}
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isSelected = draft.id === post.id;
                  return (
                    <div
                      key={post.id}
                      className={`rounded-xl border p-4 transition ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-border bg-card hover:border-border/80 hover:bg-accent/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm truncate leading-snug">{post.title}</h3>
                          <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
                            /{post.slug}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold shrink-0 ${
                            post.published
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {post.published ? (
                            <>
                              <Globe className="h-2.5 w-2.5" /> Live
                            </>
                          ) : (
                            <>
                              <Clock className="h-2.5 w-2.5" /> Draft
                            </>
                          )}
                        </span>
                      </div>

                      {post.excerpt && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Control Actions Row */}
                      <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(post)}
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                          >
                            <Edit3 className="h-3 w-3" /> Edit
                          </button>

                          {post.published ? (
                            <button
                              type="button"
                              disabled={togglePublishMut.isPending}
                              onClick={() =>
                                togglePublishMut.mutate({ id: post.id, published: false })
                              }
                              className="inline-flex items-center gap-1 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400"
                              title="Unpublish post back to draft"
                            >
                              <FileMinus className="h-3 w-3" /> Unpublish
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={togglePublishMut.isPending}
                              onClick={() =>
                                togglePublishMut.mutate({ id: post.id, published: true })
                              }
                              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                              title="Publish live to public blog"
                            >
                              <Globe className="h-3 w-3" /> Publish
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {post.published && (
                            <Link
                              to="/blog/$slug"
                              params={{ slug: post.slug }}
                              target="_blank"
                              className="text-muted-foreground hover:text-foreground p-1"
                              title="Open live post"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => setDeletingPost(post)}
                            className="text-muted-foreground hover:text-destructive p-1 transition"
                            title="Delete post"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog Modal */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Delete Post</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-foreground bg-muted/40 rounded-xl p-3 border border-border/50">
              Are you sure you want to delete <span className="font-semibold">"{deletingPost.title}"</span>?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPost(null)}
                className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium hover:bg-secondary transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteMut.isPending}
                onClick={() => deleteMut.mutate(deletingPost.id)}
                className="rounded-full bg-destructive text-destructive-foreground px-5 py-2 text-xs font-medium hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleteMut.isPending ? "Deleting…" : "Delete Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
