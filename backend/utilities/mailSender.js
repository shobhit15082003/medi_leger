import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

export const mailSender = async(email,title,body)=>{

    try{
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port:process.env.MAIL_PORT,
            secure:false, // true for 465, false for other ports
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
                // pass:"nxkc zgqb nxre lopo",
            },
        });
        
        let info=await transporter.sendMail({
            from:"MEDILEDGER",
            to:`${email}`,
            subject:`${title}`,
            text:`${body}`,
        })

        console.log('Email sent succesfully');
        console.log(info);
        return info;
    }   
    catch(error){
        console.log('Error while sending email');
        console.log('Error in mailSender util');
        console.log(process.env.MAIL_HOST);
        console.log(process.env.MAIL_PORT);
        console.log(process.env.MAIL_USER);
        console.log(process.env.MAIL_PASS);
        console.log(error.message);
        throw new Error(error); // Re-throw the error if you want to handle it elsewhere
    }
};

