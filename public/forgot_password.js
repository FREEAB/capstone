//var password=document.getElementById("password");


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

