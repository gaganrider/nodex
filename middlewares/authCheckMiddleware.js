import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
import { ApiResponse } from "../utils/apiResponse.js";
dotenv.config({ path: "../env" });

const blacklist = new Set();

export const addToBlacklist = (token) => {
  blacklist.add(token);
};

//authToken
const authCheck = asyncHandler(async (req, res, next) => {
let token;
  if (req.cookies)console.log('cookie',req.cookies) 
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      if (req.cookies.authToken) {
         token = req.cookies.authToken;
        
      }else{
        return res.status(401).json(new ApiResponse(401, null, "Authorization token is missing"));

      }
        
    }else{
      token = authHeader.split(" ")[1];
    }
   console.log('token',token)
  // const token =req.cookies.authToken
  if (blacklist.has(token)) {
    res.clearCookie("authToken", {
      httpOnly: true, // Ensures cookie is not accessible from client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "None", // Allow cross-origin cookies
    });
    res.status(200).json(new ApiResponse(200, null, "token Expired"));
  }
  // console.log(token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; // Attach decoded user data to req object
  next();
});

export default authCheck;
