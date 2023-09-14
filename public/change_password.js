
const passwordForm = document.querySelector('#password_form');

// Creating event listener for create_form submission
createForm.addEventListener('submit', async (event) => {

    // Prevent default form submission behavior
    event.preventDefault();


    const email = passwordForm.elements['email'].value;
    const password = passwordForm.elements['password'].value;
    const confirmed_password = passwordForm.elements['confirm_password'].value;

    if (password !== confirmed_password) {
        alert("Passwords do not match") 
        return
    }

    try {
        const response = await fetch('/change_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        console.log(response.json())
        if (response.ok) {
            window.location.href = '/dashboard' 
        } else {
            alert ("There was an error")
        }
    } catch (error) {
        console.error("There was an error changing your password: ", error)
    }
})