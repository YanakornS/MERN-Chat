import Message from "../Models/message.model.js";
import User from "../Models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json({ users: filteredUsers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while getting user info" });
  }
};
