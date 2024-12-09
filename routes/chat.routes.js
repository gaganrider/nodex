import { Router } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {uploadImage} from "../utils/imageHandler.js";
import authCheck from "../middlewares/authCheckMiddleware.js";
import { aceeptChatRequest, getAllChats, getChatDetails, sendImage, sendMessage } from "../controllers/chatController.js";
import { get } from "mongoose";
import { getAllMessages } from "../controllers/chatController.js";
import upload from "../utils/multer.js";
const router=Router()
// statusCode, data, message




router.get('/getAllChats',authCheck,getAllChats)
router.post('/getAllMessages',authCheck,getAllMessages)
router.post('/sendMessage',authCheck,sendMessage)
router.get('/getChatDetails/:chatId',authCheck,getChatDetails)
router.get('/acceptChatRequest/:chatId',authCheck,aceeptChatRequest)
// router.post('/user-login',loginWithPhone)
router.post('/sendImage',authCheck,upload.array('images', 5), sendImage)






export default router;