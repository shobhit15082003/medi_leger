import { app } from "./app.js";
import dbConnect from "./config/dbConnect.js";

const port = process.env.PORT || 4000;

dbConnect()
.then(() => {
    app.listen(port, () => {
        console.log(`Server Running on port: ${port}`);
    })
})
.catch((error) => {
    console.log(`Server connection failed`);
})