export interface Blog{
    id: number;
    title: string;
    category: string[];
    description: string;
    date: string;
    coverImage: string;
    content: string;
}

export interface CreateBlogDTO{
    title: string;
    category: string[];
    description: string;
    date: string;
    coverImage: string;
    content: string;
}