import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.get("/all-users", UserController.getAllUsers);
router.get("/all-users/:userId", UserController.getUserById);
router.post("/register", UserController.createUser);
router.patch("/update-user/:userId", UserController.updateUser);
router.delete("/delete-user/:userId", UserController.deleteUser);
export const UserRoutes = router;
