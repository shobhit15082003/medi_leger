import { asyncHandler } from '../utilities/asyncHandler'
import { ApiError } from "../utilities/ApiError.js"; 
import { ApiResponse } from "../utilities/ApiResponse.js"; 
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

export const signup = asyncHandler(async (req, res) => {
    const {role,
        username,
        email,
        password,
        confirmPassword,  
        first_name,
        last_name, 
        gender,
        contact_info,
        
    }=req.body;
    if (!username||!email||!password||!confirmPassword||!first_name||!last_name||!gender||!contact_info) {
        throw new ApiError(400, "All fields are required");
    }
    
    if(role==="Patient")
    {
        const{
            date_of_birth,
            address,
            aadhar_number,
        }=req.body;
        if (!date_of_birth) {
            throw new ApiError(400, "Date of birth is required");
        }
        if(!address){
            throw new ApiError(400,"Address is required");
        }
        if(!aadhar_number){
            throw new ApiError(400,"Address is required");
        }

    }
    else if(role==="Doctor"){
        const{
            speciality,
            license_number,
            work_address,
        }=req.body;
        if (!speciality) {
            throw new ApiError(400, "Speciality is required");
        }
        if(!license_number){
            throw new ApiError(400,"License Number is required");
        }
        if(!work_address){
            throw new ApiError(400,"Work Address is required");
        }
    }

    //if confirm password and password do not match
    if(confirmPassword!==password){
        throw new ApiError(400,"Password and confirm password do not match")
    }

    //if email already exits
    const exisitingUser=await User.findOne({email:email});
    if(exisitingUser){
        throw new ApiError(400,"Email is already registered");
    }

    const hashedPassword=await bcrypt.hash(password,10);

    const newUser=await User.create({
        username:username,
        email:email,
        password:hashedPassword,
        role:role,
    });

    if(role==="Patient"){
        const newPatient=await Patient.create({
            first_name:first_name,
            last_name:last_name,
            date_of_birth:date_of_birth,
            gender:gender,
            contact_info:contact_info,
            address:address,
            image:`https://api.dicebear.com/7.x/initials/svg?seed=${firstName}`,
            aadhar_number:aadhar_number,
            user_id:newUser._id,
        });
    }
    else if(role==="Doctor"){
        const newDoctor=await Doctor.create({
            first_name:first_name,
            last_name:last_name,
            speciality:speciality,
            contact_info:contact_info,
            gender:gender,
            license_number:license_number,
            work_address:work_address,
            image:`https://api.dicebear.com/7.x/initials/svg?seed=${firstName}`,
            user_id:newUser._id,
        });
    }

    const updatedUser = await User.findByIdAndUpdate(
        newUser._id, 
        {
            patient_id: role==="Patient"? newPatient._id : null,
            doctor_id: role==="Doctor" ? newDoctor._id : null,
        },
        {
            new: true, // returns the updated document
            runValidators: true, // runs schema validators
        });


    return res.status(200).json(
        new ApiResponse(200,updatedUser, "User registered Successfully")
    )

    //Doubts:
    // 1)How to send the catch error
    // 2)How to take image as input
    // 3)Dealing with otp is still left and needs to done and updated over here
    // 4)When asking for email then username is not required
    

});
