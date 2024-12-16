import mongoose from "mongoose";    

const labResultSchema  = new mongoose.Schema({
    patient_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true,
    },
    doctor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true,
    },
    labAssistant_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'LabAssistant',
        required:true,
    },
    facility_name:{ //new point added
        type:String,
        required:true,
    },
    result_summary : [{
        type:String
    }],

},
    {timestamps: true} // Automatically adds createdAt and updatedAt
);

const LabResult = mongoose.model("LabResult",labResultSchema);
export default LabResult;