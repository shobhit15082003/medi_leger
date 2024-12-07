import mongoose from "mongoose";    

const labAssistantSchema  = new mongoose.Schema({
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
    certificate:{
        type:String,
		required:true,
    },
    work_address:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    assignedTests: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "LabResult",
		},
	],
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    }, //sus
    yearsOfExperience:{
        type:String,
        required:true,
    },
    

	
	
});

const LabAssistant = mongoose.model("LabAssistant",labAssistantSchema);
export default LabAssistant;