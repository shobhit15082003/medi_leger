// Utilities
import { asyncHandler } from '../utilities/asyncHandler.js'
import { ApiError } from "../utilities/ApiError.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { uploadOnCloudinary } from '../utilities/cloudinary.js'
import { mailSender } from '../utilities/mailSender.js'

// librarires
import bcrypt from "bcrypt"
import otpGenerator from 'otp-generator'


// models
import User from '../models/User.js'
import Patient from '../models/Patient.js'
import Doctor from '../models/Doctor.js'
import OTP from '../models/Otp_model.js'
import { mailSender } from '../utilities/mailSender.js'








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
        emergencyContact,
        yearsOfExperience,

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
        if(!emergencyContact){
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
        if(!yearsOfExperience){
            throw new ApiError(400,"Years of Experience is required");
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
    const hashedAadhar_number = `**** **** ${aadhar_number.slice(-4)}`;


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
            aadhar_number:hashedAadhar_number,
            user_id:newUser._id,
            emergencyContact:emergencyContact,
        });
    }
    else if(role === "Doctor") {
        newDoctor = await Doctor.create({
            first_name: first_name,
            last_name: last_name,
            specialization: specialization,
            contact_info: contact_info,
            gender: gender,
            license_number: license_number,
            work_address: work_address,
            image: imageUrl,
            user_id: newUser._id,
           yearsOfExperience: yearsOfExperience ? `${yearsOfExperience}+` : "0+",
            availability: false,
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





//login
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
    {
        user=await User.findOne({email:email}).populate("Doctor");
        user.availability=true;
    }   
    else if(user.role==="Patient")
        user=await User.findOne({email:email}).populate("Doctor");
    
    //checking if password is correct
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



    //when the otp is being created there is a pre being called which sends the otp there itself which sends the otp on email.

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "OTP Sent Successfully")
    )


});





//change password
//VVVIP it need auth middleware to be called before calling it
export const changePassword = asyncHandler(async (req, res) => {
    
    const userDetails=await User.findById(req.user._id);  //little doubt whther it is _id or id

    const {oldPassword,newPassword,confirmNewPassword}=req.body;

    const passMatch=bcrypt.compare(oldPassword,userDetails.password);
    
    if(!oldPassword||!newPassword||!confirmNewPassword)
        throw new ApiError(400,"All fields are required");

    if(newPassword!==confirmNewPassword)
        throw new ApiError(400,"Password and confirm password do not match");

    if(!passMatch)
        throw new ApiError(400,"Enter the correct exisiting password");

    const hashedPassword=await bcrypt.hash(newPassword,10);

    const newUser=await User.findByIdAndUpdate(userDetails._id,
        {password:hashedPassword},
        {new:true}
    );
    newUser.password=null;
    console.log('Password updated successfully');
    console.log(newUser);


    //sending mail
    try{
        const mail=await mailSender(userDetails.email,"Password Changed",`Password has been changed for ${userDetails.first_name} ${userDetails.last_name} with the email id: ${userDetails.email}`);
        console.log('Email for Password successfully changed has been sent');
        console.log(mail.response);
    }
    catch(err){
        throw new ApiError(400,"error in sending mail in change password");
        console.log(err.message);
    }

    return res.status(200).json(
        new ApiResponse(200, newUser, "Password Changed Successfully")
    );

});







//request for reset password
export const requestResetPassword = asyncHandler(async (req, res) => {
    
    const {email}=req.body;

    //checking if email is entered
    if(!email)
        throw new ApiError(400,"Enter the email");

    //getting the details of the email entered
    const user=await User.findOne({email:email});

    //checking if the user with this email exists
    if(!user)
        throw new ApiError(400,"User does not exist");


    //creating otp
    var otp = otpGenerator.generate(6, { 
        digits: true, 
        upperCaseAlphabets: true, 
        lowerCaseAlphabets: false, 
        specialChars: false 
    });
    
    //storing the otp in db
    const otpBody=await OTP.create({email,otp});
    console.log('Entry created in DB model');

    //sending the email
    try{
        const mail=await mailSender(userDetails.email,"Reset Password OTP",`Otp for password to be changed for ${userDetails.first_name} ${userDetails.last_name} with the email id: ${userDetails.email} the otp is ${otp}`);
        console.log('Otp for changing of mail has been changed');
        // console.log(mail.response);
    }
    catch(err){
        throw new ApiError(400,"error in sending mail in reset password");
        console.log(err.message);
    }


    return res.status(200).json(
        new ApiResponse(200, newUser, "OTP for reset password sent successfully")
    );

});






//reset password
export const resetPassword = asyncHandler(async (req, res) => {
    
    const {email,otp,newPassword,confirmNewPassword}=req.body;

    if(!email||!otp||!newPassword||!confirmNewPassword)
        throw new ApiError(400,"All fields are required");

    if(newPassword!==confirmNewPassword)
        throw new ApiError(400,"Passwords do not match");


    //getting the user details
    const user=await User.findOne({email:email});
   
    //checking if user exists
    if(!user)
        throw new ApiError(400,"Email is not registered");


    //find most recent otp
    const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1); 
    console.log(recentOtp[0].otp);
    //  console.log(otp);
 
    //validate otp
    if(recentOtp.length==0){
       //OTP NOT FOUND
        throw new ApiError(400,"OTP not found with registered email");
    }
 
    else if(otp!==recentOtp[0].otp){
        throw new ApiError(400,"Wrong OTP");
    }

    //hashing password
    const hashedPassword=await bcrypt.hash(newPassword,10);
    
    const newUser=await User.findByIdAndUpdate(user._id,
        {password:hashedPassword},
        {new:true}
    );
    newUser.password=null;
    console.log('Password updated successfully');
    console.log(newUser);




    return res.status(200).json(
        new ApiResponse(200, newUser, "Password Reset successfull")
    );

});




//delete a User
export const deleteUser = asyncHandler(async (req, res) => {
    
    const id = req.body._id;
    const user=await User.findById(id);
    const otherId=user.role==="Patient"?user.patient_id:user.doctor_id;

    if(user.role==="Patient")
        await Patient.findByIdAndDelete(otherId);
    if(user.role==="Doctor")
        await Doctor.findByIdAndDelete(otherId);
    await User.findByIdAndDelete(id);
    
    return res.status(200).json(
        new ApiResponse(200, newUser, "User Successfully Deleted")
    );

});