import express from "express";

import { protectedRouter } from "../middlewares/auth.middlewares.js";
import {
  getUsersForSidebar,
  sendMessage,
  getMessage,
} from "../controllers/message.controller.js";
import { checkFriendShip } from "../middlewares/friend.middlewares.js";

const router = express.Router();

router.get("/users", protectedRouter, getUsersForSidebar);
router.get("/:id", protectedRouter, getMessage);
router.post("/send/:id", protectedRouter, checkFriendShip, sendMessage);

export default router;
