import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
const node_mode = process.env.NODE_ENV;

//export เเบบนี้สามารถ export ได้หลายตัวสามารถเลือกท่จะexportได้หลายตัว
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, secret, { expiresIn: "1d" });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true, //XSS Attack
    sameSite: "strict", //CSRF Attack
    secure: node_mode !== "development",
  });

  console.log("Token Generated ans cookie set", token);

  return token;
};
