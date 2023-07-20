//Start of Bamieh's Code

const loginForm = document.getElementById('login_form');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = loginForm.elements['email'].value;
    const password = loginForm.elements['password'].value;
    console.log(email, password);

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            console.log("It worked.")
            // window.location.href = '/dashboard';
        } else {
            alert("Invalid credentials. Try again.");
        }
    } catch (error) {
        console.error("There was an error sending login request: ", error);
    };
});

//End of Bamieh's Code