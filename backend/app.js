import express from "express";

const app = express();

// Body parser
app.use(express.json())

export { app }