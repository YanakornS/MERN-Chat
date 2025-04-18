import { generateToken } from "../lib/utils.js";
import User from "../Models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    //ถ้าเเม่กับลูกไม่เหมือนกันต้องเขียน email:email
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      const token = generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error While registering user" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid password!",
      });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error While signing in" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Success" });
  } catch (error) {}
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    // const { id: userId } = req.params;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    if (!uploadResponse) {
      return res
        .status(500)
        .json({ message: "Error while uploading profile picture" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(500).json({ message: "Error while updating profile picture" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error While Updating" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    console.log(req.user);

    res.status(200).json(req.user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while checking Auth" });
  }
};
