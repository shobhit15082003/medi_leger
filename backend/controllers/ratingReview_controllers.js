import { asyncHandler } from '../utilities/asyncHandler.js'
import { ApiError } from "../utilities/ApiError.js"
import { ApiResponse } from "../utilities/ApiResponse.js"


import User from '../models/User.js';
import Patient from '../models/Patient.js';
import RatingAndReview from '../models/RatingAndReviews.js';
import Doctor from '../models/Doctor.js';

export const createRating = asyncHandler(async (req, res) => {
    
   const userId=req.body._id;
   const user =await User.findById(userId);
    user.password=null;

   if(!user.patient_id)
        throw new ApiError(400,"Only patients can add their review");

   const patient=await Patient.findById(user.patient_id);
    patient.medical_history=null;

   const {doctorId,rating,review}=req.body;

   if(!doctorId||!rating||!review)
        throw new ApiError(400,"All fields are required");


   const checkDoctor =await Doctor.findById(doctorId);
   if(!checkDoctor)
        throw new ApiError(400,"No such doctor exists");

   const hasDoctor = patient.doctors.includes(doctorId);

   if(!hasDoctor)
        throw new ApiError(400,"This Doctor has never treated the patient");

    const alreadyReviewed= await RatingAndReview.findOne({
        patient_id:userId,
        doctor_id:doctorId,
    });

    if(alreadyReviewed)
        throw new ApiError(400,"You have already rated this doctor");

    const newRating = await RatingAndReview.create({
        patient_id:userId,
        doctor_id:doctorId,
        rating:rating,
        review:review,
    });
    console.log('Rating and review done');
    console.log(newRating);

    const updatedDoctor=await Doctor.findByIdAndUpdate(doctorId,{
        $push:{
            ratingAndReviews:newRating,
        }
    },{new:true});

    if (!updatedDoctor) 
        throw new ApiError(400, "Failed to update doctor's rating and review");


    console.log('Rating added in doctor');
    console.log(updatedDoctor);


    return res.status(200).json(
        new ApiResponse(200, newRating, "Rating and Review created successfully for the Doctor")
    );

});

export const getAllRating = asyncHandler(async (req, res) => {
    
   

    return res.status(200).json(
        new ApiResponse(200, user, "Patient's details fetched successfully")
    );

});