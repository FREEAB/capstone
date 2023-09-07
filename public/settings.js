// Start of Gronemeier's Code

// Function to duplicate select whenever you change one and to gray out option you chose for all other selects
function duplicateSelect(event) {
    let select = event.target;
    if (select.selectedIndex === 0) return;
    const newSelect = select.cloneNode(true);

    // Make sure there is no empty selects before continuing (Bamieh)
    let emptySelects = 0;
    document.querySelectorAll(".form-select").forEach((select) => {
        if (select.selectedIndex === 0) emptySelects++;
    });

    // Get container of the selection form and append the newSelect to it. Also add 'change' event listener.
    if (emptySelects === 0) {
        const container = document.querySelector('#selection-form');
        container.appendChild(newSelect);
        newSelect.addEventListener('change', duplicateSelect);
    }

    /* End of Gronemeier's Code */
    /* Start of Bamieh's Code */

    // Disable all selected options if index = 0 or index = one of the selectedIndices
    const selectedIndices = [];
    document.querySelectorAll(".form-select").forEach((select) => {
        if (select.selectedIndex !== 0) selectedIndices.push(select.selectedIndex);
    });
    document.querySelectorAll(".form-select").forEach((select) => {
        select.querySelectorAll("option").forEach((option, index) => {
            if (selectedIndices.includes(index)) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        })
    });

}

// Function to submit all selections on page to server-side for saving
async function submitChanges(event) {
    // Get all select statements
    selects = document.querySelectorAll('.form-select');

    // Go through all selects and if they are not default index (0) then push their value into troops
    let troops = [];
    selects.forEach((select) => {
        if (select.selectedIndex !== 0) {
            troops.push(select.value);
        }
    })

    // Simple POST request to /login with troops in the body as JSON object
    try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ troops }),
        });

        // If response is OK then redirect to dashboard, else alert user about error
        if (response.ok) {
            window.location.href = '/dashboard';
        } else {
            alert("Error saving troop selection.");
        }
    } catch (error) {
        console.error("There was an error saving troop selection: ", error);
    };
}

function disableSelectedOptions() {
    const selectedIndices = [];
    document.querySelectorAll(".form-select").forEach((select) => {
        if (select.selectedIndex !== 0) selectedIndices.push(select.selectedIndex);
    });
    document.querySelectorAll(".form-select").forEach((select) => {
        select.querySelectorAll("option").forEach((option, index) => {
            if (index === 0 || selectedIndices.includes(index)) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        })
    });
}
// Assigning 'change' event listener to duplicateSelect (Gronemeier)
document.querySelectorAll('.form-select').forEach((select) => {
    select.addEventListener('change', duplicateSelect);
});

document.addEventListener('DOMContentLoaded', disableSelectedOptions);

// Assigning submitChanges function to 'click' event
submitButton = document.querySelector('#submit-button');
submitButton.addEventListener('click', submitChanges);
/* End of Bamieh's Code */