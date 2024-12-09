import express from 'express'
import dotenv  from "dotenv";
dotenv.config({path:'./.env'})
import { ApiResponse } from './utils/apiResponse.js';
import userRouter from './routes/user.routes.js';
import setupRouter from './routes/setup.routes.js'
import chatRouter from './routes/chat.routes.js'
import postRouter from './routes/post.routes.js'
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from 'morgan';

const corsOrigin=process.env.CORS_ORIGIN.split(',')
const app=express()

import path from 'path';

import { fileURLToPath } from 'url';
import { tempUserCreate } from './controllers/userControllers.js';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(logger('dev'));
app.use(cors({
    origin: corsOrigin,
    allowedHeaders: ['Content-Type','Authorization','Cookie'],
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.static(path.join(__dirname, 'public')));



app.post('/api/temp',tempUserCreate)
app.use("/api/user", userRouter)
app.use("/api/setup", setupRouter)
app.use("/api/chat", chatRouter)
app.use("/api/post", postRouter)


app.all('*', (req, res) => {

  console.log('ooops',req.cookies)
    res.status(404).json({
      success: false,
      message: "Route not found",
      error: `The route ${req.originalUrl} does not exist`,
    });
  });

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.log('error',err.message)
    res.status(statusCode).json(new ApiResponse(statusCode, null, err.message));
});




export default app;
