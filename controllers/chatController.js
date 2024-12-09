import { get } from "mongoose";
import { Chat } from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImage } from "../utils/imageHandler.js";
import { io, getUser } from "../utils/socket.js";

export const getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ participants: req.user.id }).populate(
    "participants",
    "username nickName avatar"
  );
  if (chats.length > 0) {
    res.status(200).json(new ApiResponse(200, chats, "Successfull"));
  } else {
    res.status(400).json(new ApiError(200, chats, "empty chats", null));
  }
});

export const aceeptChatRequest = asyncHandler(async (req, res) => {
const chat=await Chat.findById(req.params.chatId)

if(chat.participants.includes(req.user.id) && chat.createdBY!=req.user.id){
  const updated=await Chat.findByIdAndUpdate(req.params.chatId,{accepted:true},{new:true})
  res.status(200).json(new ApiResponse(200, updated, "Successfull"));
}else{
  res.status(400).json(new ApiError(400, null, "empty messages", null));
}
});

export const getAllMessages = asyncHandler(async (req, res) => {
  const chat=await Chat.findById(req.body.chatId)
  let messages;
  if(req.body.accepted||chat.createdBY==req.user.id){
    messages= await Message.find({ conversationId: req.body.chatId }).populate('postId');
  }else{
    let data= await Message.findOne({ 
      conversationId: req.body.chatId, 
      postId: { $exists: true, $ne: null }}).sort({ createdAt: -1 }).populate('postId');
    messages=[data]
  }
  if (messages) {
    res.status(200).json(new ApiResponse(200, messages, "Successfull"));
  } else {
    res.status(400).json(new ApiError(400, null, "empty messages", null));
  }
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, message } = req.body;
  const newMessage = new Message({
    conversationId: chatId,
    sender: req.user.id,
    text: message,
  });
  await newMessage.save();
  const chat = await Chat.findById(chatId);
  chat.participants.map((x) => {
    if (x != req.user.id) {
      const user = getUser(x.toString());
      if (user) io.to(user.socketId).emit("receiveMessage", newMessage);
      // console.log("user", x.toString(), user);
    }
  });
  // console.log(chatId, message);
  res.status(200).json(new ApiResponse(200, newMessage, "Successfull"));
});

export const sendImage=asyncHandler(async(req,res)=>{
  const chat = await Chat.findById(req.body.chatId);
  if(req.files){
    let allmessage=[]
    for(let file of req.files){
      const ImageUrl = await uploadImage(file.path, file.filename);
      if(ImageUrl){
         const newMessage = new Message({
    conversationId: req.body.chatId,
    sender: req.user.id,
    imageUrl: ImageUrl,
  });
  await newMessage.save();
  allmessage.push(newMessage)
  chat.participants.map((x) => {
    if (x != req.user.id) {
      const user = getUser(x.toString());
      if (user) io.to(user.socketId).emit("receiveMessage", newMessage);
      // console.log("user", x.toString(), user);
    }
  });
 
      }
      
    }

    res.status(200).json(new ApiResponse(200, allmessage, "Successfull"));
  }  
 
// console.log(req.body.chatId,req.files)



})

export const getChatDetails = asyncHandler(async (req, res) => {
    const chat = await Chat.findById(req.params.chatId).populate(
        "participants",
        "username nickName avatar"
      );
      if (chat) {
        res.status(200).json(new ApiResponse(200, chat, "Successfull"));
      } else {
        res.status(400).json(new ApiError(400, chat, "empty messages", null));
      }
})
