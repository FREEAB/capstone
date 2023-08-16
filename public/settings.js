// Start of Gronemeier's Code

console.log("Test");
function duplicateSelect(event) {
    const select = event.target;
    if (select.selectedIndex === 0) return;
    const newSelect = select.cloneNode(true);

    // Disable selected option in the new select (YB)
    const selectedIndex = select.selectedIndex;
    newSelect.options[selectedIndex].disabled = true;

    const container = document.querySelector('#selection-form');
    container.appendChild(newSelect);
    newSelect.addEventListener('change', duplicateSelect);
}

async function submitChanges(event) {
    selects = document.querySelectorAll('.form-select');

    let troops = [];
    selects.forEach((select) => {
        if (select.selectedIndex !== 0) {
            troops.push(select.value);
        }
    })
    try {

        // Send POST request to /login and send email/password as JSON in body
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ troops }),
        });

        // If response is OK then redirect to dashboard else alert user about invalid credentials
        if (response.ok) {
            window.location.href = '/dashboard';
        } else {
            alert("Error saving troop selection.");
        }
    } catch (error) {
        console.error("There was an error saving troop selection: ", error);
    };
}

document.querySelectorAll('.form-select').forEach((select) => {
    select.addEventListener('change', duplicateSelect);
});

submitButton = document.querySelector('#submit-button');
submitButton.addEventListener('click', submitChanges);
// End of Gronemeier's Code