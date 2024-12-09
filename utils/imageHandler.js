import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import fs from "fs";
export const uploadImage = async (imgPath, imgName) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  }); 

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(imgPath, {
      public_id: imgName,
    })
    .catch((error) => {
      console.log(error);
    });
  await fs.unlink(imgPath, function (err) {
    if (err) return null;
  });
  console.log(uploadResult.url)
  return uploadResult.url;
};

export const deleteImage = async (publicId) => {
  const result = await cloudinary.v2.uploader.destroy(publicId);
};
