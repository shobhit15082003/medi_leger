import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        trim:true,
        unique: true,
    },
    password:{
        type: String,
        required:true,
        
    },
    role:{
        type:String,
        enum:["Doctor","Patient"],
        required:true,
    },
    token:{
        type:String,
        default:null,
    },
    patient_id:{
        type:String,
        default:null,
    },
    doctor_id:{
        type:String,
        default:null,
    }
});

const User = mongoose.model('User',userSchema);
export default User;