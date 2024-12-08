import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
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
    medication_list:{
        type:[String],
    }
},
    {timestamps:true}
);

const Prescription = mongoose.model("Prescription",prescriptionSchema);
export default Prescription;