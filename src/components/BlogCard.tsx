import { Blog } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: Blog;
  onClick: (id: number) => void;
  isSelected?: boolean;
}

/**
 * Compact, scannable blog card optimized for sidebar navigation.
 * Design rationale:
 * - Horizontal layout increases information density
 * - Small thumbnail provides visual anchor without dominating
 * - Title-first hierarchy for quick scanning
 * - Subtle hover/selected states guide interaction
 */
export function BlogCard({ blog, onClick, isSelected }: BlogCardProps) {
  return (
    <button
      onClick={() => onClick(blog.id)}
      className={cn(
        "w-full text-left p-3 rounded-lg transition-all duration-200",
        "hover:bg-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "group cursor-pointer",
        isSelected
          ? "bg-accent border-l-2 border-l-primary"
          : "hover:translate-x-0.5",
      )}
    >
      <div className="flex gap-3">
        {/* Compact thumbnail */}
        <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-muted">
          <img
            src={blog.coverImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Title - primary visual element */}
          <h3
            className={cn(
              "font-medium text-sm leading-snug line-clamp-2",
              "group-hover:text-primary transition-colors",
              isSelected && "text-primary",
            )}
          >
            {blog.title}
          </h3>

          {/* Meta row - date and category */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(blog.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-border">•</span>
            {blog.category.slice(0, 1).map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 font-normal"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
