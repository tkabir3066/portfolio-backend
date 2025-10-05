import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";

const router = Router();

router.get("/all-users", checkAuth(Role.ADMIN), UserController.getAllUsers);
router.get(
  "/all-users/:userId",
  checkAuth(...Object.values(Role)),
  UserController.getUserById
);

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.patch(
  "/update-user/:userId",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  UserController.updateUser
);
router.delete(
  "/delete-user/:userId",
  checkAuth(...Object.values(Role)),
  UserController.deleteUser
);
export const UserRoutes = router;
