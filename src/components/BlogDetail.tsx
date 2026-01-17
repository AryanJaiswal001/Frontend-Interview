import { Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Clock, ChevronLeft } from "lucide-react";

interface BlogDetailProps {
  blog: Blog;
  onBack: () => void;
}

/**
 * Article-style blog detail view.
 * Design rationale:
 * - No card wrapper = continuous reading experience like Medium/Substack
 * - Clear visual hierarchy: categories → title → meta → image → content
 * - Comfortable reading width (max-w-3xl) for optimal line length
 * - Generous spacing between sections for visual breathing room
 */
export function BlogDetail({ blog, onBack }: BlogDetailProps) {
  // Estimate read time based on word count (avg 200 wpm)
  const wordCount = blog.description?.split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="w-full max-w-3xl mx-auto px-4 py-6 animate-in fade-in slide-in-from-right-4 duration-300">
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
      <header className="space-y-4 mb-8">
        {/* Categories */}
        <div className="flex gap-2 flex-wrap">
          {blog.category.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="font-medium text-xs uppercase tracking-wide"
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Title - largest visual element */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
          {blog.title}
        </h1>

        {/* Meta information */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          <time className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(blog.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {readTime} min read
          </span>
        </div>
      </header>

      {/* Cover image - full width, prominent */}
      <figure className="mb-10">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        </div>
      </figure>

      {/* Article content - clean typography, no card wrapper */}
      <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
        {/* 
          Content flows naturally without card boundaries.
          In production, this would render markdown/HTML content.
        */}
        <p className="text-lg leading-relaxed text-foreground/90 first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          {blog.description}
        </p>

        {/* Placeholder for additional content sections */}
        <p className="text-muted-foreground/80 leading-relaxed">
          {blog.content || blog.description}
        </p>
      </div>

      {/* Article footer */}
      <footer className="mt-12 pt-8 border-t border-border/50">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
          <div className="flex gap-2">
            {blog.category.map((cat) => (
              <Badge key={cat} variant="outline" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </footer>
    </article>
  );
}
