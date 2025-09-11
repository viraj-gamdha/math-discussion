import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "@/controllers/auth.js";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/refresh_token", refreshToken);
authRoutes.post("/logout", logoutUser);

export { authRoutes };
