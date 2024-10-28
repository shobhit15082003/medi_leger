import express from "express";
import dbConnect from "./config/mediledger.js"
const app = express();

const PORT=process.env.PORT || 4000;



app.listen(PORT, () => {
    console.log('Server started');
})

dbConnect();