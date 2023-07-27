/* Start of Bamieh's Code */

// Grab login_form element
const createForm = document.getElementById('create_form');

// Creating event listener for create_form submission
createForm.addEventListener('submit', async (event) => {

    // Prevent default form submission behavior
    event.preventDefault();

    // Grab values from form elements
    const firstName = createForm.elements['first_name'].value;
    const lastName = createForm.elements['last_name'].value;
    const email = createForm.elements['email'].value;
    const password = createForm.elements['password'].value;
    const secretKey = createForm.elements['secret_key'].value;
    const role = createForm.elements['role'].value;

    try {

        // Send POST request to /login and send email/password as JSON in body
        const response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, email, password, secretKey, role }),
        });

        // If response is OK then redirect to dashboard else alert user about invalid credentials
        if (response.ok) {
            window.location.href = '/dashboard';
        } else {
            alert("Invalid key.");
        }
    } catch (error) {
        console.error("There was an error registering: ", error);
    };
});

/* End of Bamieh's Code */