import express from "express";
import {
  signup,
  signin,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectedRouter } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/logout", logout);

router.put("/update-profile", protectedRouter, updateProfile);

router.get("/check", protectedRouter, checkAuth);

export default router;
