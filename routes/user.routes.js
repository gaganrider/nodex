import { Router } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {uploadImage} from "../utils/imageHandler.js";
import { changeAvatar,getUserDetails,loginWithPhone, logout, updateDetails,usernameCheck,verifyOtp} from "../controllers/userControllers.js";
import authCheck from "../middlewares/authCheckMiddleware.js";
import upload from "../utils/multer.js";
import { Prefrence } from "../models/prefrenceModel.js";
const router=Router()
// statusCode, data, message






router.post('/user-login',loginWithPhone)
router.post('/verify-otp',verifyOtp)
router.get('/getuserdetails',authCheck,getUserDetails)
router.post('/update-details',authCheck,updateDetails)
router.post('/username-check',usernameCheck)
router.post('/logout', authCheck, logout)
router.post('/change-avatar',authCheck,upload.single('avatar'),changeAvatar)





export default router;