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


// Initialize QueryClient
const queryClient = new QueryClient();

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-20">
        <div className="container mx-auto py-3 px-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={resetView}
          >
            <span className="bg-primary text-primary-foreground font-bold p-1 rounded">
              CA
            </span>
            <h1 className="text-xl font-bold tracking-tight">Monk Blog</h1>
          </div>
          <Button
            onClick={() => {
              setIsCreating(true);
              setSelectedBlogId(null);
            }}
            size="sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="container mx-auto p-4 flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-65px)] overflow-hidden">
        {/* --- Left Panel: Blog List --- */}
        {/* Helper logic: Hidden on mobile if detail is active, always visible on desktop */}
        <div
          className={`md:col-span-4 lg:col-span-3 flex flex-col h-full ${selectedBlogId || isCreating ? "hidden md:flex" : "flex"}`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-muted-foreground">
              Recent Articles
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              title="Refresh list"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4 overflow-y-auto pr-2 pb-20 custom-scrollbar flex-grow">
            {isLoadingBlogs && (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading articles...
                </p>
              </div>
            )}

            {isErrorBlogs && (
              <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg text-destructive text-sm flex gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{errorBlogs.message}</span>
              </div>
            )}

            {blogs?.map((blog) => (
              <div
                key={blog.id}
                className={`transition-all duration-200 ${selectedBlogId === blog.id ? "ring-2 ring-primary rounded-xl translate-x-1" : ""}`}
              >
                <BlogCard blog={blog} onClick={handleCardClick} />
              </div>
            ))}

            {!isLoadingBlogs && blogs?.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No blog posts found.
              </div>
            )}
          </div>
        </div>

        {/* --- Right Panel: Detail OR Create Form --- */}
        <div
          className={`md:col-span-8 lg:col-span-9 h-full overflow-y-auto bg-muted/20 border rounded-xl p-4 md:p-8 ${!selectedBlogId && !isCreating ? "hidden md:block" : "block"}`}
        >
          {isCreating ? (
            <div className="max-w-2xl mx-auto">
              <CreateBlogForm
                onSubmit={handleCreateSubmit}
                onCancel={resetView}
              />
            </div>
          ) : selectedBlogId ? (
            isLoadingDetail ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground animate-pulse">
                  Fetching content...
                </p>
              </div>
            ) : selectedBlog ? (
              <BlogDetail blog={selectedBlog} onBack={resetView} />
            ) : (
              // Fallback if ID exists but data is null (rare)
              <div className="text-center py-20">Post not found.</div>
            )
          ) : (
            // Empty State (Desktop only usually)
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 space-y-4">
              <div className="bg-muted p-6 rounded-full">
                <div className="text-6xl grayscale opacity-50">📰</div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground">
                  Select an article
                </h3>
                <p className="text-sm mt-1">
                  Choose a post from the sidebar to start reading
                </p>
              </div>
            </div>
          )}
        </div>
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
