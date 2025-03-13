import express from "express";

import { protectedRouter } from "../middlewares/auth.middlewares.js";
import { getUsersForSidebar } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectedRouter, getUsersForSidebar);

export default router;
