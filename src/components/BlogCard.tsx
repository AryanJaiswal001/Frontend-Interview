import { memo, useCallback } from "react";
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
 * Category-to-color mapping for semantic visual distinction.
 * Uses Tailwind's color palette with muted tones for professionalism.
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

/**
 * Compact, scannable blog card optimized for sidebar navigation.
 * Design rationale:
 * - Horizontal layout increases information density
 * - Small thumbnail provides visual anchor without dominating
 * - Title-first hierarchy for quick scanning
 * - Subtle hover/selected states guide interaction
 * - Memoized to prevent re-renders when other cards change
 */
const BlogCardComponent = memo(function BlogCard({
  blog,
  onClick,
  isSelected,
}: BlogCardProps) {
  const handleClick = useCallback(() => onClick(blog.id), [onClick, blog.id]);
  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left p-3 rounded-lg transition-all duration-150",
        "hover:bg-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "group cursor-pointer",
        isSelected
          ? "bg-accent shadow-sm border-l-2 border-l-primary"
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
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4 font-medium border-0",
                  getCategoryColor(cat),
                )}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
});

export { BlogCardComponent as BlogCard };
