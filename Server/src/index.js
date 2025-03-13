import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRouter from "./routers/auth.router.js";
import { app, server } from "./lib/socket.js";
import messageRouter from "./routers/message.router.js";

dotenv.config();

const POST = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Welcome  To Restful API MERN Chat </h1>");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);

server.listen(POST, () => {
  console.log("Server is running on http://localhost:" + POST);
  connectDB();
});
