import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiError } from "../utilities/ApiError.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler( async(req, res, next) => {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        
    if(!token) {
        throw new ApiError(401, "Unauthorized request");
    }
    
    // console.log(token);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedToken);

    const user = await User.findById(decodedToken?.id).select("-password -refreshToken");
    // console.log(user);

    if(!user) {
        throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;
    next();
} )

export default verifyJWT;