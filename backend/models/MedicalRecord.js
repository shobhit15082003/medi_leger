import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    patient_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true,
    },
    doctor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true,
    },
    nurse_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Nurse',
        required:true,
    },
    diagnosis:{
        type:String,
        required:true,
    },
    treatment:{
        type:String,
        required:true,
    },
    medications:[{ //little doubt
        type:mongoose.Schema.Types.ObjectId,
        ref:'Prescription'
    }],
    notes:{
        type:String,
    },
    labResults:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'LabResults',
    }]
},
    {timestamps:true}
);

const MedicalRecord = mongoose.model("MedicalRecord",medicalRecordSchema);
export default MedicalRecord;