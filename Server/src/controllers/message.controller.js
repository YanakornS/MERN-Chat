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

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver Id is required" });
    }

    const senderId = req.user._id;

    const { text, image } = req.body;
    let imageURL;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }

    // const imageURL =
    const newMessage = await new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });
    await newMessage.save();

    //Real time Chat
    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log(receiverSocketId);
    if (receiverSocketId) {
      console.log("Emit");
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage);
    console.log(newMessage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while  sending message" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while getting message " });
  }
};
