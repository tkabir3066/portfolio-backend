import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/google", AuthController.authWithGoogle);

export const AuthRoutes = router;
