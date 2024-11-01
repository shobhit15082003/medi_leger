import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

export { app }