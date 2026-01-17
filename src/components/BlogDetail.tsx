import { Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BlogDetailProps {
  blog: Blog;
  onBack: () => void;
}

export function BlogDetail({ blog, onBack }: BlogDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Articles
      </Button>

      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {blog.category.map((cat) => (
            <Badge key={cat} variant="secondary">
              {cat}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {blog.title}
        </h1>

        <div className="flex items-center text-muted-foreground gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(blog.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>5 min read</span>
          </div>
        </div>
      </div>

      <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="h-full w-full object-cover"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-stone dark:prose-invert max-w-none">
            {/* 
              In a real application, this description would likely be markdown 
              or HTML content. We're using the description for now.
            */}
            <p className="text-lg leading-relaxed">{blog.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
