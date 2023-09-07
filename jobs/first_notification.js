// Carrasco's code

// Importing necessary libraries
const nodeMailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

// Database model connection object 
const userDatabase = require('../models/user_model.js');
const scheduleDatabase = require('../models/schedule_model.js');
const supervisesDatabase = require('../models/supervises_model.js')


async function sendEmail() {
    const dateCopy = new Date();
    // Returns schedule data for todays date as array of objects
    const scheduleOnDate = await scheduleDatabase.getScheduleBetweenDates(dateCopy, dateCopy)

    // creates array of user ids that have filled out schedule for today 
    const scheduleID = []
    for (member of scheduleOnDate) {

        scheduleID.push(member.user_id)

    }


    // returns  all users from data base and adds their ids in an array 
    const users = await userDatabase.getUsers()
    const userIDList = []
    for (member of users) {
        userIDList.push(member.id)
    }
    // Returns Array of users that have not filled out schedule for today 
    const toRemove = new Set(scheduleID);

    const id = userIDList.filter(x => !toRemove.has(x));

    // Returns false if everyone has filled out their schedule for today. Keeps running code if else 
    if (id === undefined || id.length == 0) {
        return false;
    } else {
        //Creates array of objects containing supervisor ids    
        const supervisor = []

        for (member of id) {
            const getSupervisor = await supervisesDatabase.getSupervisorByTroopID(member)
            const getID = getSupervisor[0]
            supervisor.push(getID)
        }
        //Removes undefinied values from array 
        const supervisorfilter = supervisor.filter(item => !!item);
        //creates array of supervisor ids
        const supervisorList = []
        for (member of supervisorfilter) {
            supervisorList.push(member.supervisor_id)
        }

        //removes duplicates from array
        const supervisorID = [...new Set(supervisorList)];
        //creates array of objects containing supervisor emails

        const supervisorArray = []
        for (member of supervisorID) {
            const getEmail = await userDatabase.getUserEmailByID(member)
            supervisorArray.push(getEmail)

        }
        //creates array of supervisor emails

        const supervisorEmail = []
        for (member of supervisorArray) {
            supervisorEmail.push(member.email)
        }
        
        const troop = []

        for (member of id) {
            const getTroop = await supervisesDatabase.getTroopBySupervisorID(member)
            const getID = getTroop[0]
            troop.push(getID)
        }
        const troopfilter = troop.filter(item => !!item);

        const trooplist = []
        for (member of troopfilter) {
            trooplist.push(member.troop_id)
        }

        const troopID = [...new Set(trooplist)];

        const troopName = []
        for (member of troopID) {
            const getName = await userDatabase.getUserLastNameByID(member)
            troopName.push(getName)
        };

        const troopLastName = []
        for (member of troopName) {
            troopLastName.push(member.last_name)
        }
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
            to: [`${supervisorEmail}`], //MULTIPLE RECEIVERS
            subject: "Hello", //EMAIL SUBJECT
            text: `Sir/Ma'am ${troopLastName.join(", ")} haven't filled out their accountability tracker.`, //EMAIL BODY IN TEXT FORMAT
            html: `<b>Sir/Ma'am ${troopLastName.join(", ")} haven't filled out their accountability tracker.</b>`, //EMAIL BODY IN HTML FORMAT
        })
        console.log('Message sent: ' + message.messageId)
        console.log(message.accepted)
        console.log(message.rejected)
        return;
    }


}
sendEmail().catch(err => console.log(err));