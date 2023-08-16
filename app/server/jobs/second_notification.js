const nodeMailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

// Database model connection object 
const userDatabase = require('../models/user_model.js');
const scheduleDatabase = require('../models/schedule_model.js');
const supervisesDatabase = require('../models/supervises_model.js');

async function test() {
    const dateCopy = new Date();
    console.log(scheduleDatabase.convertDate(dateCopy))
    const scheduleOnDate =  await scheduleDatabase.getScheduleBetweenDates(dateCopy, dateCopy)
    console.log(scheduleOnDate)
    const scheduleID = []
    for (member of scheduleOnDate) {
        
        scheduleID.push(member.user_id)
       
    }
    console.log(scheduleID)
    console.log('/')
    const users = await userDatabase.getUsers()
    const userIDList =[]
    for (member of users) {
         
        
        userIDList.push(member.id)
       
    }
    const toRemove = new Set(scheduleID);
    console.log(userIDList)
    const id = userIDList.filter( x => !toRemove.has(x) );
    console.log(id)
    const supervisorID =[]
    // for (member of id) {
         
        
    //     const supervisor = await supervisesDatabase.getSupervisorByTroopID(member)
    //     console.log(supervisor)
    //     supervisorID.push(supervisor)
    // }
    // console.log(supervisorID)
    // const supervisorName =[]
    // for (member of supervisorID) {
    //     const getName = await userDatabase.getUserEmailByID(member) 
    //     supervisorName.push(getName)
        
    // };
    //console.log(supervisorName)
    const getEmail = await userDatabase.getUserEmailByRoleID(3)
    
    const adminEmail = []
    adminEmail.push(getEmail.email)
    console.log(adminEmail)
   
    async function sendEmail() {
        

        //Transporter configuration
        let transporter = nodeMailer.createTransport(smtpTransport({
            name: 'smtp.office365.com',
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: 'ernest3443@hotmail.com', //REPLACE WITH YOUR EMAIL ADDRESS
                pass: 'Nene3443' //REPLACE WITH YOUR EMAIL PASSWORD
            }
        }));

        //Email configuration
        const message = await transporter.sendMail({
            from: "ernest3443@hotmail.com", //SENDER
            to: [`${adminEmail}`], //MULTIPLE RECEIVERS
            subject: "Hello", //EMAIL SUBJECT
            text: `sergeant/s  some of your drops haven't filled out there accountability tracker.`, //EMAIL BODY IN TEXT FORMAT
            html: "<b>`sergeant/s ${supervisorName} some of your drops haven't filled out there accountability tracker.`</b>", //EMAIL BODY IN HTML FORMAT
        })
        console.log('Message sent: ' + message.messageId)
        console.log(message.accepted)
        console.log(message.rejected)
        
    }

    sendEmail().catch(err => console.log(err));

}
test()
