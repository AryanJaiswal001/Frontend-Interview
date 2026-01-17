import { memo, useMemo } from "react";
import { Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Clock, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogDetailProps {
  blog: Blog;
  onBack: () => void;
}

/**
 * Category-to-color mapping for semantic visual distinction.
 */
const categoryColors: Record<string, string> = {
  technology:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  design:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  business:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  lifestyle: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  travel:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  health: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  food: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  science: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  default: "bg-secondary text-secondary-foreground",
};

const getCategoryColor = (category: string): string => {
  const key = category.toLowerCase();
  return categoryColors[key] || categoryColors.default;
};

interface BlogDetailProps {
  blog: Blog;
  onBack: () => void;
}

/**
 * Article-style blog detail view.
 * Design rationale:
 * - No card wrapper = continuous reading experience like Medium/Substack
 * - Clear visual hierarchy: categories → title → meta → image → content
 * - Comfortable reading width (max-w-3xl) for optimal line length (~65 chars)
 * - Generous spacing between sections for visual breathing room
 * - Memoized to prevent unnecessary re-renders
 */
export const BlogDetail = memo(function BlogDetail({
  blog,
  onBack,
}: BlogDetailProps) {
  // Estimate read time based on word count (avg 200 wpm) - memoized
  const readTime = useMemo(() => {
    const wordCount = blog.description?.split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [blog.description]);

  // Format date once - memoized
  const formattedDate = useMemo(() => {
    return new Date(blog.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [blog.date]);

  return (
    <article className="w-full max-w-3xl mx-auto px-6 py-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Back navigation - subtle but accessible */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="-ml-3 mb-8 text-muted-foreground hover:text-foreground group"
        size="sm"
      >
        <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        All Articles
      </Button>

      {/* Article header */}
      <header className="space-y-5 mb-10">
        {/* Categories */}
        <div className="flex gap-2 flex-wrap">
          {blog.category.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className={cn(
                "font-medium text-xs uppercase tracking-wide border-0",
                getCategoryColor(cat),
              )}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Title - largest visual element with improved typography */}
        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-foreground leading-[1.15] text-balance">
          {blog.title}
        </h1>

        {/* Meta information with better spacing */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
          <time className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground/70" />
            {formattedDate}
          </time>
          <span className="text-border/60">•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground/70" />
            {readTime} min read
          </span>
        </div>
      </header>

      {/* Cover image - full width, prominent with optimized loading */}
      <figure className="mb-12">
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted/50 ring-1 ring-border/10">
          <img
            src={blog.coverImage}
            alt={blog.title}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover transition-opacity duration-300"
          />
        </div>
      </figure>

      {/* Article content - enhanced typography for long-form reading */}
      <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
        {/* 
          Content flows naturally without card boundaries.
          In production, this would render markdown/HTML content.
        */}
        <p className="text-lg leading-[1.8] tracking-[-0.01em] text-foreground/90 first-letter:text-5xl first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-primary">
          {blog.description}
        </p>

        {/* Additional content with comfortable reading typography */}
        <p className="text-base leading-[1.85] tracking-[-0.01em] text-muted-foreground/90 mt-6">
          {blog.content || blog.description}
        </p>
      </div>

      {/* Article footer */}
      <footer className="mt-16 pt-8 border-t border-border/40">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
          <div className="flex gap-2">
            {blog.category.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className={cn("text-xs border-0", getCategoryColor(cat))}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </footer>
    </article>
  );
});
