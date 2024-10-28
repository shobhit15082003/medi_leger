const mongoose=require('mongoose')

require('dotenv').config();
const db=()=>{
    mongoose.connect(process.env.DATABASE_URL,{})
    .then(console.log('Database connected'))
    .catch((error)=>{
        console.log('Database connection failed')
        console.log(error.message);
        process.exit(1);
    })
}
module.exports = db;