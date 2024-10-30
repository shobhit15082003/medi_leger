import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({

});

const Patient = mongoose.model("Patient",patientSchema);
export default Patient;