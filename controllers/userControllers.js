import User from "../models/userModel.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { addToBlacklist } from "../middlewares/authCheckMiddleware.js";
import { uploadImage } from "../utils/imageHandler.js";
import { ApiError } from "../utils/apiError.js";
dotenv.config({ path: "../env" });



export const loginWithPhone = asyncHandler(async (req, res) => {
  const user = await User.findOne(
    { email: req.body.email },
    { nickName: 1, username: 1, password: 1, avatar: 1 }
  );
  if (user) {
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
      // , {expiresIn: "1h",}
    );

    res.cookie("authToken", token, {
      httpOnly: false, // Allow client-side access via JavaScript
      secure: false, // Use HTTPS in production
      sameSite: "None",
      maxAge: 3600000*4, // 4 hour expiration
      path: "/",
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          id: user._id,
          token: token,
          // newUser: user.newUser,
          username: user.username,
          nickName: user.nickName,
          avatar: user.avatar,
        },
        "Login successful"
      )
    );
    // res.status(200).json(new ApiResponse(201, user, "Login successfull"));
  } else {
    res.status(300).json(new ApiResponse(300, null, "Login failed"));
  }
});











export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.authToken;

  res.clearCookie("authToken", {
    httpOnly: true, // Ensures cookie is not accessible from client-side JavaScript
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "None", // Allow cross-origin cookies
  });
  addToBlacklist(token);
  res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});
