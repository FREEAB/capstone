
const nodeMailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const userDatabase = require('../models/user_model.js');


async function sendPasswordEmail(id, password) {
    
    // returns  all users from data base and adds their ids in an array 
    
    const user = await userDatabase.getUserByID(id)

    
        //Transporter configuration
        let transporter = nodeMailer.createTransport(smtpTransport({
            name: 'smtp.gmail.com',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
                user: 'kaeleamathimne@gmail.com', //REPLACE WITH YOUR EMAIL ADDRESS
                pass: 'nxketiaendhjpael' //REPLACE WITH YOUR EMAIL PASSWORD
            }
        }));

        //Email configuration
        const message = await transporter.sendMail({
            from: "kaeleamathimne@gmail.com", //SENDER
            to: `${user.email}`, //MULTIPLE RECEIVERS
            subject: "Password Reset", //EMAIL SUBJECT
            text: `Sir/Ma'am here is your generated reset password. ${password}`, //EMAIL BODY IN TEXT FORMAT
            html: `<b>Sir/Ma'am here is your generated reset password. ${password}</b>`, //EMAIL BODY IN HTML FORMAT
        })
        console.log('Message sent: ' + message.messageId)
        console.log(message.accepted)
        console.log(message.rejected)
        return;
    }

//sendEmail().catch(err => console.log(err));

module.exports = {
    sendPasswordEmail
}