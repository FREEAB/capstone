//var password=document.getElementById("password");

function genPassword() {
   var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   var passwordLength = 12;
   var password = "";
for (var i = 0; i <= passwordLength; i++) {
   var randomNumber = Math.floor(Math.random() * chars.length);
   password += chars.substring(randomNumber, randomNumber +1);
  }
}
//const resetToken = crypto.randomBytes(32).toString("hex")
//const hash = await bcrypt.hash(resetToken, Number(bcryptSalt))

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
            alert("Email sent")
            window.location.href = '/'
        } else {
            alert("Invalid email. Please try again")
        }
    } catch (error) {
        console.error("There was an error sending reset request: ", error)
    }
})