import { Router } from "express";
import { 
    signup,
    login,
    sendOTP,
    changePassword,
} from "../controllers/user_controllers.js";
import upload from "../middlewares/multer_middleware.js"
import verifyJWT from "../middlewares/auth_middleware.js";
import auth from "../middlewares/auth_middleware.js";


const userRouter = Router();


userRouter.route("/signup").post(upload.single('image'), signup);
userRouter.route("/login").post(login);
userRouter.route("/otp").post(sendOTP);
userRouter.route("/changepassword").post(auth,changePassword);

export default userRouter;