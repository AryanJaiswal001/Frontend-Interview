import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "@/services/api";
import { CreateBlogDTO } from "@/types/blog";

//Hook to get all blogs
export const useBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: blogApi.getAllblogs,
  });
};

//Hook to get single blog by ID
export const useBlog = (id: number) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogApi.getBlogById,
    enabled: !!id, //Only run if valid ID
  });
};

//Hook to create a new blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blog: CreateBlogDTO) => blogApi.createBlog(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
