import { asyncHandler } from '../utilities/asyncHandler'
import { ApiError } from "../utilities/ApiError.js"; 
import { ApiResponse } from "../utilities/ApiResponse.js"; 
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

export const signup = asyncHandler(async (req, res) => {
    const {role,
        email,
        password,
        confirmPassword,  
        first_name,
        last_name, 
        gender,
        contact_info,
        
    }=req.body;
    if (!email||!password||!confirmPassword||!first_name||!last_name||!gender||!contact_info) {
        throw new ApiError(400, "All fields are required");
    }
    // if(contact_info.length!==10)
    //     throw new ApiError(400,"Lenght of phone number should be 10");

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
        if(aadhar_number.length!==12)
            throw new ApiError(400,"Enter a 12 digit valid aadhar number");

    }
    else if(role==="Doctor"){
        const{
            specialization,
            license_number,
            work_address,
        }=req.body;
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
            specialization:specialization,
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
        throw new ApiError(400,"Password is incorrect"); //wrong password
    }

});
