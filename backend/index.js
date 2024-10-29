import { app } from "./app.js";
import dbConnect from "./config/dbConnect.js";

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server Running on port: ${port}`);
})

dbConnect();