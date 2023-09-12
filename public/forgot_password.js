var password=document.getElementById("password");

 function genPassword() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 12;
    var password = "";
 for (var i = 0; i <= passwordLength; i++) {
   var randomNumber = Math.floor(Math.random() * chars.length);
   password += chars.substring(randomNumber, randomNumber +1);
  }
}
const forgotForm = document.getElementById('forgot_password')

forgotForm.addEventListener('submit', async (event) => {

    event.preventDefault()

    const email = forgotForm.elements['email'].value;

    try {
        const response = await fetch('/forgot_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        })

        if(response.ok) {
            sendEmail()
            alert("Email sent")
            window.location.href = '/'
        } else {
            alert("Invalid email. Please try again")
        }
    } catch (error) {
        console.error("There was an error sending reset request: ", error)
    }
})
async function sendEmail() {
    
    // returns  all users from data base and adds their ids in an array 
    const users = await userDatabase.getUsers()
    const userIDList = []
    for (member of users) {
        userIDList.push(member.id)
    }
    const memberArray = []
    for (member of userIDList){
        const getEmail = await userDatabase.getEmailByID(member)
        memberArray.push(getEmail)
    }
    const memberEmail = []
    for (member of memberArray) {
        memberEmail.push(member.email)
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
            to: [`${memberEmail}`], //MULTIPLE RECEIVERS
            subject: "Password Reset", //EMAIL SUBJECT
            text: `Sir/Ma'am here is your generated reset password. ${password}`, //EMAIL BODY IN TEXT FORMAT
            html: `<b>Sir/Ma'am $here is your generated reset password. ${password}</b>`, //EMAIL BODY IN HTML FORMAT
        })
        console.log('Message sent: ' + message.messageId)
        console.log(message.accepted)
        console.log(message.rejected)
        return;
    }



sendEmail().catch(err => console.log(err));