import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) {
            return { success: false, message: "File path is required", statusCode: 400 };
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        if(!response) {
            return { success: false, message: "Cloudinary did not return a response", statusCode: 503 };
        }

        fs.unlinkSync(localFilePath)
        return { success: true, data: response, statusCode: 200};
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        console.error("Cloudinary upload error:", error);
        return { success: false, message: "An error occurred while uploading file", statusCode: 500 };
    }
}

export { uploadOnCloudinary }