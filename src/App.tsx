import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { BlogCard } from "@/components/BlogCard";
import { BlogDetail } from "@/components/BlogDetail";
import { CreateBlogForm } from "@/components/CreateBlogForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { Blog } from "@/types/blog";

// Initialize QueryClient with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// --- API Functions ---

const fetchBlogs = async (): Promise<Blog[]> => {
  const res = await fetch("http://localhost:3001/blogs");
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
};

const fetchBlogById = async (id: number): Promise<Blog> => {
  const res = await fetch(`http://localhost:3001/blogs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch blog post");
  return res.json();
};

const createBlog = async (newBlog: any) => {
  // Transform form data to match API requirements
  const blogPayload = {
    ...newBlog,
    // Convert comma-separated categories string to array
    category: newBlog.category.split(",").map((c: string) => c.trim()),
    // Add missing fields required by backend
    date: new Date().toISOString(),
    content: newBlog.description, // Using description as content since form has one field
  };

  const res = await fetch("http://localhost:3001/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blogPayload),
  });

  if (!res.ok) throw new Error("Failed to create blog");
  return res.json();
};

// --- Main App Component ---

function BlogApp() {
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  // 1. Query: Get All Blogs
  const {
    data: blogs,
    isLoading: isLoadingBlogs,
    isError: isErrorBlogs,
    error: errorBlogs,
    refetch,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  // 2. Query: Get Single Blog (Dependent on selectedBlogId)
  const { data: selectedBlog, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["blog", selectedBlogId],
    queryFn: () => fetchBlogById(selectedBlogId!),
    enabled: !!selectedBlogId, // Only run this query if an ID is selected
  });

  // 3. Mutation: Create Blog
  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      // Refresh the list after success
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setIsCreating(false);
      // Optional: Navigate to the new blog or list
    },
    onError: (error) => {
      console.error("Failed to post:", error);
      alert("Failed to create post. Please try again.");
    },
  });

  const handleCreateSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const handleCardClick = (id: number) => {
    setIsCreating(false);
    setSelectedBlogId(id);
    // On mobile, this will shift view due to CSS classes below
  };

  const resetView = () => {
    setIsCreating(false);
    setSelectedBlogId(null);
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur z-20 shrink-0">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={resetView}
          >
            <span className="bg-primary text-primary-foreground font-bold px-2.5 py-1.5 rounded-md text-sm tracking-wide">
              CA
            </span>
            <h1 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              Monk Blog
            </h1>
          </div>
          <Button
            onClick={() => {
              setIsCreating(true);
              setSelectedBlogId(null);
            }}
            size="sm"
            className="shadow-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </header>

      {/* Main Layout - Fixed height for independent scroll */}
      <main className="flex-1 container mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden">
        {/* --- Left Panel: Blog List --- */}
        {/* Helper logic: Hidden on mobile if detail is active, always visible on desktop */}
        <aside
          className={`md:col-span-4 lg:col-span-3 flex flex-col overflow-hidden border-r border-border/50 pr-4 ${selectedBlogId || isCreating ? "hidden md:flex" : "flex"}`}
        >
          <div className="pb-3 flex items-center justify-between shrink-0 border-b border-border/50 mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Articles
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => refetch()}
              title="Refresh list"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Independent scrollable list */}
          <div className="space-y-1 overflow-y-auto flex-1 -mr-2 pr-2">
            {isLoadingBlogs && (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Loading...</p>
              </div>
            )}

            {isErrorBlogs && (
              <div className="p-3 border border-destructive/30 bg-destructive/10 rounded-lg text-destructive text-xs flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorBlogs.message}</span>
              </div>
            )}

            {blogs?.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onClick={handleCardClick}
                isSelected={selectedBlogId === blog.id}
              />
            ))}

            {!isLoadingBlogs && blogs?.length === 0 && (
              <div className="text-center py-16 space-y-2">
                <div className="text-3xl opacity-30">📝</div>
                <p className="text-sm font-medium text-muted-foreground">
                  No articles yet
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Create your first post to get started
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* --- Right Panel: Detail OR Create Form --- */}
        <section
          className={`md:col-span-8 lg:col-span-9 overflow-y-auto ${!selectedBlogId && !isCreating ? "hidden md:flex" : "flex"}`}
        >
          {isCreating ? (
            <div className="max-w-2xl mx-auto w-full py-4">
              <CreateBlogForm
                onSubmit={handleCreateSubmit}
                onCancel={resetView}
              />
            </div>
          ) : selectedBlogId ? (
            isLoadingDetail ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Loading article...
                </p>
              </div>
            ) : selectedBlog ? (
              <BlogDetail blog={selectedBlog} onBack={resetView} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Post not found.</p>
              </div>
            )
          ) : (
            // Empty State - More prominent and instructive
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                <span className="text-3xl">📖</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Select an article to read
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Choose a post from the sidebar, or create a new one to get
                started.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// Wrap App with Provider
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlogApp />
    </QueryClientProvider>
  );
}
