import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Doctor", "Patient"],
    required: true,
  },
  token: {
    type: String,
    default: null,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    default: null,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    default: null,
  },
  // nurse_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Nurse",
  //   default: null,
  // },
  // labAssistant_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "LabAssistant",
  //   default: null,
  // },
});

const User = mongoose.model("User", userSchema);
export default User;
