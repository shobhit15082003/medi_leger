import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiError } from "../utilities/ApiError.js";

// isPatient
const isPatient = asyncHandler( async(req, res, next) => {
    if(req.user.role!=="Patient"){
        throw new ApiError(401,"This is a protected route for Patient only")
    }
    next();
} )

// isDoctor
const isDoctor = asyncHandler( async(req, res, next) => {
    if(req.user.role!=="Doctor"){
        throw new ApiError(401,"This is a protected route for Doctor only")
    }
    next();
} )

//exporting
export { isPatient, isDoctor };