import { asyncHandler } from '../utilities/asyncHandler.js'
import { ApiError } from "../utilities/ApiError.js"
import { ApiResponse } from "../utilities/ApiResponse.js"

import User from '../models/User.js'
import Appointment from '../models/Appointment.js'
import Patient from '../models/Patient.js'
import Doctor from '../models/Doctor.js'

export const createAppointment = asyncHandler(async (req, res) => {
    const { patient_id, doctor_id } = req.body;

    const patient = await Patient.findById(patient_id);
    if(!patient) {
        throw new ApiError(404, 'Patient not found');
    }

    const doctor = await Doctor.findById(doctor_id);
    if(!doctor) {
        throw new ApiError(404, 'Doctor not found');
    }

    const appointment = await Appointment.create({
        patient_id,
        doctor_id,
    });

    return res.status(201).json(
        new ApiResponse(201, { 
            appointment_id: appointment._id, // returning appointment_id to use while updating status and uploading summary
            appointment,
        }, 'Appointment created successfully')
    );
});
  

export const getAppointmentsByUser = asyncHandler(async (req, res) => {
    const { user_id, role } = req.user;
    
    if(!user_id || !role) {
        throw new ApiError(400, 'User ID and Role are required');
    }
    
    let filter, successMessage;

    if(role === 'doctor') {
        filter = { doctor_id: user_id };
        successMessage = 'Doctor Appointments fetched successfully';
    } else if(role === 'patient') {
        filter = { patient_id: user_id };
        successMessage = 'Patient Appointments fetched successfully';
    } else {
        throw new ApiError(400, 'Invalid role');
    }
    
    const appointments = await Appointment.find(filter);
  
    if(!appointments.length) {
        throw new ApiError(404, 'No appointments found for the user');
    }
  
    return res.status(200).json(
        new ApiResponse(200, appointments, successMessage)
    );
});


export const updateStatus = asyncHandler(async (req, res) => {
    const { appointment_id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
        'scheduled',
        'consulting',
        'diagnosing',
        'under_treatment',
        'monitoring',
        'discharged',
    ];
    if(!validStatuses.includes(status)) {
        throw new ApiError(400, 'Invalid status');
    }

    const appointment = await Appointment.findOneAndUpdate(
        { _id: appointment_id },
        { status },
        { new: true }
    );

    if(!appointment) {
        throw new ApiError(404, 'Appointment not found');
    }

    return res.status(200).json(
        new ApiResponse(200, appointment, 'Appointment status updated successfully')
    );
});


export const uploadSummary = asyncHandler(async (req, res) => {
    const { appointment_id } = req.params;

    if(!req.file) {
        throw new ApiError(400, 'No file uploaded');
    }

    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

    if(!cloudinaryResponse.success) {
        throw new ApiError(
            cloudinaryResponse.statusCode,
            cloudinaryResponse.message
        );
    }

    const fileUrl = cloudinaryResponse.data.url;

    const appointment = await Appointment.findOneAndUpdate(
        { _id: appointment_id },
        { summary: fileUrl },
        { new: true }
    );

    if(!appointment) {
        throw new ApiError(404, 'Appointment not found');
    }

    return res.status(200).json(
        new ApiResponse(200, appointment, 'Summary uploaded successfully')
    );
});