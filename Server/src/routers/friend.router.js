import express from "express";
import {
  addFriend,
  acceptFriendRequest,
} from "../controllers/friend.controllers.js";
import { protectedRouter } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/add", protectedRouter, addFriend);
router.post("/accept", protectedRouter, acceptFriendRequest);

export default router;
