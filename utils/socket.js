import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });
import jwt from "jsonwebtoken";
import app from "../app.js";
import { sendMessage } from "../controllers/chatController.js";
import Message from "../models/messageModel.js";
import { Chat } from "../models/chatModel.js";
const corsOrigin = process.env.CORS_ORIGIN.split(",");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin, // Replace with your frontend domain
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  },
});

let activeUsers = [];

const addUser = (userId, socketId) => {
  !activeUsers.some((user) => user.userId === userId) &&
    activeUsers.push({ userId, socketId });
  console.log("useradded");
};

const removeUser = (socketId) => {
  activeUsers = activeUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return activeUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  const token = socket.handshake.auth.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Authentication error:", err);
      return socket.disconnect(); // Disconnect if token is invalid
    }
    socket.user = decoded;

    console.log("User connected:", socket.id);
    // sendMessage(socket,io,getUser);

    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", activeUsers);
      console.log(activeUsers);
    });

    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", activeUsers);
    });
  });
});

export { io, getUser };
export default server;
