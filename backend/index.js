import { app } from "./app.js";
import dbConnect from "./config/dbConnect.js";

const port = process.env.PORT || 4000;


//routes
import userRoutes from './routes/user_routes.js';
app.use('/api/v1/auth', userRoutes); // This works if the import is correct





dbConnect()
.then(() => {
    app.listen(port, () => {
        console.log(`Server Running on port: ${port}`);
    })
})
.catch((error) => {
    console.log(`Server connection failed`);
})