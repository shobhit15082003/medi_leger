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

// isNurse
const isNurse = asyncHandler( async(req, res, next) => {
    
    if(req.user.role!=="Nurse"){
        throw new ApiError(401,"This is a protected route for Nurse only")
    }
    next();
} )

// isLabAssistant
const isLabAssistant = asyncHandler( async(req, res, next) => {
    
    if(req.user.role!=="Lab Assistant"){
        throw new ApiError(401,"This is a protected route for Lab Assistant only")
    }
    next();
} )


//exporting
export { isPatient, isDoctor, isNurse, isLabAssistant };