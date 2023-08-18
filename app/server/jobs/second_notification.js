// Importing necessary libraries
const nodeMailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

// Database model connection object 
const userDatabase = require('../models/user_model.js');
const scheduleDatabase = require('../models/schedule_model.js');
const supervisesDatabase = require('../models/supervises_model.js');


async function sendEmail() {
    const dateCopy = new Date();
    // Returns schedule data for todays date as array of objects
    const scheduleOnDate =  await scheduleDatabase.getScheduleBetweenDates(dateCopy, dateCopy)
    
    // creates array of user ids that have filled out schedule for today 
    const scheduleID = []
    for (member of scheduleOnDate) {
        
        scheduleID.push(member.user_id)
    
    }
    
    
    // returns  all users from data base and adds their ids in an array 
    const users = await userDatabase.getUsers()
    const userIDList =[]
    for (member of users) {
    userIDList.push(member.id)   
    }
    // Returns Array of users that have not filled out schedule for today 
    const toRemove = new Set(scheduleID);
    
    const id = userIDList.filter( x => !toRemove.has(x) );
    
    // Returns false if everyone has filled out their schedule for today. Keeps running code if else 
    if (id === undefined || id.length == 0) {
      return false;
    }else {
        //Creates array of objects containing supervisor ids    
        const supervisor =[]

        for (member of id) {
            const getSupervisor = await supervisesDatabase.getSupervisorByTroopID(member)
            const getID =  getSupervisor[0]
            supervisor.push(getID)
        }
        //Removes undefinied values from array 
        const supervisorfilter  = supervisor.filter(item => !!item);
        //creates array of supervisor ids
        const supervisorList = []
        for (member of supervisorfilter) {
            supervisorList.push(member.supervisor_id)
        }
        
        //removes duplicates from array
        const supervisorID = [...new Set(supervisorList)];
        
        //creates array of objects containing supervisor last names
        const supervisorName =[]
        for (member of supervisorID) {
            const getName = await userDatabase.getUserLastNameByID(member) 
            supervisorName.push(getName)    
        };
        //creates array of supervisor last names
        const supervisorLastName = []
        for (member of supervisorName) {
            supervisorLastName.push(member.last_name)
            
        }
        
        //Creates array of admin emails 
        const getEmail = await userDatabase.getUserEmailByRoleID(3)
        
        const adminEmail = []
        adminEmail.push(getEmail.email)
        



    

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
        text: `sergeant/s ${supervisorLastName} troops haven't filled out there accountability tracker.`, //EMAIL BODY IN TEXT FORMAT
        html: `<b>sergeant/s ${supervisorLastName} troops haven't filled out there accountability tracker.</b>`, //EMAIL BODY IN HTML FORMAT
    })
    console.log('Message sent: ' + message.messageId)
    console.log(message.accepted)
    console.log(message.rejected)
    
}

    
}
sendEmail().catch(err => console.log(err));
