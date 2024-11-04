import mongoose from "mongoose";    

const doctorSchema  = new mongoose.Schema({
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
	specialization:{
		type:[String],
	},
	contact_info:{
        type:String,
        required:true,
    },
	gender:{
        type:String,
    },
    license_number:{
        type:String,
		unique: true, // Ensures each doctor has a unique license number
    },
    work_address:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    ratingAndReviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "RatingAndReview",
		},
	],
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    },
	
	
});

const Doctor = mongoose.model("Doctor",doctorSchema);
export default Doctor;