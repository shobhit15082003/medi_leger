// Utilities
import { asyncHandler } from '../utilities/asyncHandler.js'
import { ApiError } from "../utilities/ApiError.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { uploadOnCloudinary } from '../utilities/cloudinary.js'

// librarires
import bcrypt from "bcrypt"
import otpGenerator from 'otp-generator'


// models
import User from '../models/User.js'
import Patient from '../models/Patient.js'
import Doctor from '../models/Doctor.js'
import OTP from '../models/Otp_model.js'






//signup
export const signup = asyncHandler(async (req, res) => {
    const {
        username,
        email,
        password,
        confirmPassword,
        role,  
        first_name,
        last_name, 
        gender,
        contact_info,
        // optional (role based)
        date_of_birth,
        address,
        aadhar_number,
        specialization,
        license_number,
        work_address,
        otp,
    } = req.body;
    
    if (!username||!email||!password||!confirmPassword||!role||!first_name||!last_name||!gender||!contact_info) {
        throw new ApiError(400, "All fields are required");
    }
    
    // if(contact_info.length!==10)
    //     throw new ApiError(400,"Lenght of phone number should be 10");

    if(role==="Patient") {
        if (!date_of_birth) {
            throw new ApiError(400, "Date of birth is required");
        }
        if(!address){
            throw new ApiError(400,"Address is required");
        }
        if(!aadhar_number){
            throw new ApiError(400,"Address is required");
        }
        if(aadhar_number.length!==12) {
            throw new ApiError(400,"Enter a 12 digit valid aadhar number");
        }
    }
    else if(role==="Doctor"){
        if (!specialization) {
            throw new ApiError(400, "Specialization is required");
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
    const exisitingUser = await User.findOne({email:email});
    if(exisitingUser){
        throw new ApiError(400,"Email is already registered");
    }

    //coudinary image upload
    let imageUrl;
    if(req.file) {
        console.log(req.file);
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        imageUrl = cloudinaryResponse.data.url
    } else {
        //default
        imageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${first_name}`;
    }
    if(!imageUrl) {
        throw new ApiError(400,"Image Upload on cloudinary error");
    }


     //find most recent otp
     const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1); 
     console.log(recentOtp[0].otp);
    //  console.log(otp);
 
     //validate otp
     if(recentOtp.length==0){
       //OTP NOT FOUND
       throw new ApiError(400,"OTP not found");
     }
 
     else if(otp!==recentOtp[0].otp){
        throw new ApiError(400,"Wrong OTP");
     }
     

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username: username,
        email:email,
        password:hashedPassword,
        role:role,
    });

    let newPatient = null, newDoctor = null;
    if(role==="Patient") {
        newPatient = await Patient.create({
            first_name:first_name,
            last_name:last_name,
            date_of_birth:date_of_birth,
            gender:gender,
            contact_info:contact_info,
            address:address,
            image:imageUrl,
            aadhar_number:aadhar_number,
            user_id:newUser._id,
        });
    }
    else if(role==="Doctor") {
        newDoctor = await Doctor.create({
            first_name:first_name,
            last_name:last_name,
            specialization:specialization,
            contact_info:contact_info,
            gender:gender,
            license_number:license_number,
            work_address:work_address,
            image:imageUrl,
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
        }
    );



    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User registered Successfully")
    )
    // 3)Dealing with otp is still left and needs to done and updated over here
});

//lofin
export const login = asyncHandler(async (req, res) => {
    //getting the credentials
    const {email,password}=req.body;

    if(!email||!password){
        throw new ApiError(400,"All fields are required");
    }

    const user =await User.findOne({email:email});

    if(!user){
        throw new ApiError(400,"User is not registered");
    }
    
    if(user.role==="Doctor")
        user=await User.findOne({email:email}).populate("Doctor");
    else if(user.role==="Patient")
        user=await User.findOne({email:email}).populate("Doctor");
    
    //checking ig password is correct
    if(bcrypt.compare(password,user.password)){
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
            patient_id:patient_id,
            doctor_id:doctor_id,
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"10h",
        });
        user.password=undefined;
        user.token=token; //passing the token in the user's body

        const options ={
            expires: new Date(Date.now()+3*24*60*60*1000),//3 days
            httpOnly:true
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            user,
            token,
           message:"Logged in successfully",
        });
    }
    else{
        throw new ApiError(400, "Password is incorrect"); //wrong password
    }

});

//otp
export const sendOTP = asyncHandler(async (req, res) => {

    const {email}=req.body;

    if(!email)
        throw new ApiError(400,"Email is missing");

    const registeredUser= await User.findOne({email:email});
    
    if(registeredUser){
        throw new ApiError(400,"User is already registered");
    }

    
    var otp = otpGenerator.generate(6, { 
        digits: true, 
        upperCaseAlphabets: true, 
        lowerCaseAlphabets: false, 
        specialChars: false 
    });
    

    
    const otpBody=await OTP.create({email,otp});
    console.log('Entry created in DB model');
    // console.log(otpBody);


    return res.status(200).json(
        new ApiResponse(200, updatedUser, "OTP Sent Successfully")
    )


});