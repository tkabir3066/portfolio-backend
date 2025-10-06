import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { BlogService } from "./blog.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    console.log(userId);
    const result = await BlogService.createBlog(req.body, userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Blog Created Successfully",
      data: result,
    });
  }
);
const getAllBlogs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await BlogService.getAllBlogs();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All Blogs retrieved Successfully",
      data: result,
    });
  }
);
const getSingleBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.blogId;
    const result = await BlogService.getSingleBlog(blogId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Blog retrieved Successfully",
      data: result,
    });
  }
);
const updateBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.blogId;
    const result = await BlogService.updateBlog(blogId, req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Blog Updated Successfully",
      data: result,
    });
  }
);

const deleteBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.blogId;
    const result = await BlogService.deleteBlog(blogId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Blog retrieved Successfully",
      data: result,
    });
  }
);
export const BlogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
