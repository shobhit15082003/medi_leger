import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multerTest from "./tests/multer_test.js";

const app = express();

app.use(cors());
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// multerTest(app);

import userRouter from "./routes/user_routes.js";
import appointmentRouter from "./routes/appointment_routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

export { app };