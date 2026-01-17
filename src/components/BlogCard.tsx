import { Blog } from "@/types/blog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface BlogCardProps {
  blog: Blog;
  onClick: (id: number) => void;
}

export function BlogCard({ blog, onClick }: BlogCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="aspect-video w-full overflow-hidden relative">
        <img
          src={blog.coverImage}
          alt={blog.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <CardHeader>
        <div className="flex gap-2 mb-2 flex-wrap">
          {blog.category.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>
        <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
          {blog.title}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground gap-2 pt-1">
          <Calendar className="h-3 w-3"></Calendar>
          <span>{new Date(blog.date).toLocaleDateString()}</span>
        </div>
      </CardHeader>

      <CardContent className="grow">
        <CardDescription className="line-clamp-3">
          {blog.description}
        </CardDescription>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button className="w-full" onClick={() => onClick(blog.id)}>
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}
