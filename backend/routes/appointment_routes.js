import { Router } from "express";
import {
    createAppointment,
    getAppointmentsByUser,
    updateStatus,
    uploadSummary,
} from "../controllers/appointment_controllers.js";
import upload from "../middlewares/multer_middleware.js";
import verifyJWT from "../middlewares/auth_middleware.js";

const appointmentRouter = Router();

appointmentRouter.route("/create").post(verifyJWT, createAppointment);
appointmentRouter.route("/").get(verifyJWT, getAppointmentsByUser);
appointmentRouter.route("/:appointment_id/status").patch(verifyJWT, updateStatus);
appointmentRouter.route("/:appointment_id/summary").post(verifyJWT, upload.single("file"), uploadSummary);

export default appointmentRouter;