import { Router } from "express";
import { 
    signup,
    login
} from "../controllers/user_controllers.js";
import upload from "../middlewares/multer_middleware.js"
import verifyJWT from "../middlewares/auth_middleware.js";

const userRouter = Router();


userRouter.route("/signup").post(upload.single('image'), signup);
userRouter.route("/login").post(login);

export default userRouter;