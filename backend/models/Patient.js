import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
        trim:true,
    },
    last_name:{
        type:String,
        required:true,
        trim:true,
    },
    date_of_birth:{
        type:Date,
    },
    gender:{
        type:String,
    },
    contact_info:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    medical_history:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MedicalRecord',
    }],
    image:{
        type:String,
    },
    aadhar_number: {
        type: String, // Changed to String to preserve any leading zeroes
        unique:true,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        

    },
    doctors: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor",
		},
        
	],
    isActive:{
        type:Boolean,
    },
    emergencyContact:{
        type:Number,
        required: true,
    }



});

const Patient = mongoose.model("Patient",patientSchema);
export default Patient;