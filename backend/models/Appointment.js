import mongoose from "mongoose";    

const appointmentSchema  = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    doctor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true,
    },
    // nurse_id:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Nurse',
    //     // required:true,
    // },
    status:{
        type: String,
        enum: [
            'scheduled',
            'consulting',
            'diagnosing',
            'under_treatment',
            'monitoring',
            'discharged'
        ],
        default: 'scheduled',
    },
    summary:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MedicalRecord',
    }], //little doubt over here
},
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Appointment = mongoose.model("Appointment",appointmentSchema);
export default Appointment;