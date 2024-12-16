import mongoose from "mongoose";    

const nurseSchema  = new mongoose.Schema({
    // first_name:{
    //     type:String,
    //     required:true,
    //     trim:true,
    // },
    // last_name:{
    //     type:String,
    //     required:true,
    //     trim:true,
    // },
	// contact_info:{
    //     type:String,
    //     required:true,
    // },
	// gender:{
    //     type:String,
    // },
    // license_number:{
    //     type:String,
	// 	unique: true, 
    // },
    // work_address:{
    //     type:String,
    //     required:true,
    // },
    // image:{
    //     type:String,
    // },
    // user_id:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"User",

    // }, //sus
    // yearsOfExperience:{
    //     type:String,
    //     required:true,
    // },
    

	
	
});

const Nurse = mongoose.model("Nurse",nurseSchema);
export default Nurse;