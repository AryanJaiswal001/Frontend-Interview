import {Blog,CreateBlogDTO} from '../types/blog';

const API_BASE_URL="http://localhost:3001";

export const blogApi={
    //Get all blogs 
    getAllblogs:async():Promise<Blog[]>=>{
        const response=await fetch(`${API_BASE_URL}/blogs`);
        if(!response.ok){
            throw new Error("Failed to fetch blogs");
        }
        return response.json();
    },

//Get blog by ID
getBlogById:async(id:number):Promise<Blog>=>{
    const response=await fetch(`${API_BASE_URL}/blogs/${id}`);
    if(!response.ok){
        throw new Error("Failed to fetch blog");
    }
    return response.json();
},

//Create a new blog
createBlog:async (blog:CreateBlogDTO):Promise<Blog>=>{
    const response=await fetch(`${API_BASE_URL}/blogs`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify(blog)
    });
    if(!response.ok){
        throw new Error("Failed to create blog");
    }
    return response.json();
},
};