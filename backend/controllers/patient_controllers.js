import { asyncHandler } from '../utilities/asyncHandler.js'
import { ApiError } from "../utilities/ApiError.js"
import { ApiResponse } from "../utilities/ApiResponse.js"


import User from '../models/User.js';
import Patient from '../models/Patient.js';


export const updatePatient = asyncHandler(async (req, res) => {
    
    const email = req.body.email;
    const userId=await User.findOne({email:email});
    const exisitingPatient=await Patient.findById(userId.patient_id); //little deliema over here


    // Destructure and set defaults for any missing fields from req.body
    let {
        first_name = existingPatient.first_name,
        last_name = existingPatient.last_name,
        date_of_birth = existingPatient.date_of_birth,
        gender = existingPatient.gender,
        contact_info = existingPatient.contact_info,
        address = existingPatient.address,
        aadhar_number = existingPatient.aadhar_number
    } = req.body;
    
    //coudinary image upload
    let imageUrl;
    if(req.file) {
        console.log(req.file);
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        imageUrl = cloudinaryResponse.data.url
    } else {
        //default
        imageUrl = exisitingPatient.image;
    }
    if(!imageUrl) {
        throw new ApiError(400,"Image Upload on cloudinary error");
    }


    const newPatient=await Patient.findByIdAndUpdate(exisitingPatient._id,{
        first_name:first_name,
        last_name:last_name,
        date_of_birth:date_of_birth,
        gender:gender,
        contact_info:contact_info,
        address:address,
        image:imageUrl,
        aadhar_number:aadhar_number,
        }, {new:true}
    );

    //Dounts:
    //1)Not sure if profile image will be updated


    return res.status(200).json(
        new ApiResponse(200, newPatient, "Patient's Profile Updated Successfull")
    );

});

export const getAllDetailsPatient = asyncHandler(async (req, res) => {
    
    const email = req.body.email;
    const user=await User.findOne({email:email}).populate("patient_id").exec();

    if (!user) {
        throw new ApiError(404, "Patient not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Patient's details fetched successfully")
    );

});



