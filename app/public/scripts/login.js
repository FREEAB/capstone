/* Start of Bamieh's Code */

// Grab login_form element
const loginForm = document.getElementById('login_form');

// Creating event listener for login_form submission
loginForm.addEventListener('submit', async (event) => {

    // Prevent default form submission behavior
    event.preventDefault();

    // Grab email and password values from form elements
    const email = loginForm.elements['email'].value;
    const password = loginForm.elements['password'].value;

    try {

        // Send POST request to /login and send email/password as JSON in body
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // If response is OK then redirect to dashboard else alert user about invalid credentials
        if (response.ok) {
            window.location.href = '/dashboard';
        } else {
            alert("Invalid credentials. Try again.");
        }
    } catch (error) {
        console.error("There was an error sending login request: ", error);
    };
});

/* End of Bamieh's Code */