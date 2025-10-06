import { Blog, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import slugify from "slugify";

const createBlog = async (
  payload: Prisma.BlogCreateInput,
  userId: string
): Promise<Blog> => {
  const { title, content, thumbnail, published } = payload;

  // 1️⃣ Basic validation
  if (!title || !content) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Title and content are required."
    );
  }

  // 2️⃣ Generate slug from title
  let baseSlug = slugify(title, { lower: true, strict: true }); // e.g., "my-awesome-post"
  let slug = baseSlug;

  // 3️⃣ Ensure slug is unique
  let counter = 1;
  while (await prisma.blog.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`; // e.g., "my-awesome-post-1"
  }

  const newBlog = await prisma.blog.create({
    data: {
      title,
      content,
      thumbnail: thumbnail || null,
      published: published ?? false,
      slug,
      authorId: userId,
    },
  });
  return newBlog;
};

const getAllBlogs = async () => {
  const allBlogs = await prisma.blog.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      thumbnail: true,
      published: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          picture: true,
          role: true,
          bio: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  return allBlogs;
};

const getSingleBlog = async (blogId: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          contact: true,
          picture: true,
        },
      },
    },
  });

  if (!blog) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Blog not found");
  }

  return blog;
};

const updateBlog = async (blogId: string, payload: Partial<Blog>) => {
  const blog = await prisma.blog.findUnique({ where: { id: blogId } });

  if (!blog) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Blog not found");
  }
  const updatedBlog = await prisma.blog.update({
    where: {
      id: blogId,
    },
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          contact: true,
          picture: true,
        },
      },
    },
  });

  return updatedBlog;
};

const deleteBlog = async (blogId: string) => {
  const blog = await prisma.blog.findUnique({ where: { id: blogId } });

  if (!blog) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Blog not found");
  }
  const result = await prisma.blog.delete({
    where: {
      id: blogId,
    },
  });

  return result;
};
export const BlogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
