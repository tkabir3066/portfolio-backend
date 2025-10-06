import { Router } from "express";
import { BlogController } from "./blog.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/all-blogs",
  checkAuth(...Object.values(Role)),
  BlogController.getAllBlogs
);
router.get(
  "/all-blogs/:blogId",
  checkAuth(...Object.values(Role)),
  BlogController.getSingleBlog
);
router.post(
  "/create-blog",
  checkAuth(...Object.values(Role)),
  BlogController.createBlog
);

router.patch(
  "/update-blog/:blogId",
  checkAuth(...Object.values(Role)),
  BlogController.updateBlog
);
router.delete(
  "/delete-blog/:blogId",
  checkAuth(...Object.values(Role)),
  BlogController.deleteBlog
);

export const BlogRoutes = router;
