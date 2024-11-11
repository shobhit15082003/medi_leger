import { asyncHandler } from '../utilities/asyncHandler.js'
import { ApiError } from "../utilities/ApiError.js"
import { ApiResponse } from "../utilities/ApiResponse.js"


import User from '../models/User.js';
import Doctor from '../models/Doctor.js';


export const updateDoctor = asyncHandler(async (req, res) => {
    
    const email = req.body.email;
    const userId=await User.findOne({email:email});
    const exisitingDoctor=await Doctor.findById(userId.doctor_id); //little deliema over here

    // Destructure fields from req.body and set defaults if fields are missing
    let {
        first_name = existingDoctor.first_name,
        last_name = existingDoctor.last_name,
        specialization = existingDoctor.specialization,
        contact_info = existingDoctor.contact_info,
        gender = existingDoctor.gender,
        work_address = existingDoctor.work_address
    } = req.body;
    
    //coudinary image upload
    let imageUrl;
    if(req.file) {
        try {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            imageUrl = cloudinaryResponse.data.url;
        } catch (error) {
            throw new ApiError(400, "Image upload on Cloudinary failed");
        }
    } else {
        //default
        imageUrl = exisitingDoctor.image;
    }
    if(!imageUrl) {
        throw new ApiError(400,"Image Upload on cloudinary error");
    }
 

    const newDoctor=await Doctor.findByIdAndUpdate(exisitingDoctor._id,{
        first_name:first_name,
        last_name:last_name,
        specialization:specialization,
        contact_info:contact_info,
        gender:gender,
        work_address:work_address,
        image:imageUrl,
        }, {new:true}
    );

    //Dounts:
    //1)Not sure if profile image will be updated


    return res.status(200).json(
        new ApiResponse(200, newDoctor, "Doctor's Profile Updated Successfull")
    );

});


export const getAllDetailsDoctor = asyncHandler(async (req, res) => {
    
    const email = req.body.email;
    const user=await User.findOne({email:email}).populate("doctor_id").exec();

    if (!user) {
        throw new ApiError(404, "Doctor not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Doctor's details fetched successfully")
    );

});