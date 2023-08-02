/* Start of Bamieh's Code (Lines were edited by Gronemeier for front-end compatibility) */

/**
 * @param {Date} date - Date object for date that you want to add from
 * @param {*} days - Amount of days you'd like to add to date
 * @returns - Returns a date object with added days
 */
function addDays(date, days) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() + days);
    return dateCopy;
}

/**
 * @param {Date} date - Date object you'd like to print
 * @returns - String representation of date object
 */
function getFullDate(date) {
    let dayName = date.toLocaleString('default', { weekday: 'long' });
    let month = date.toLocaleString('default', { month: 'long' });
    let day = date.getDate();
    return (String(dayName) + " " + String(day) + " " + String(month));
}

// Defining necessary variables
const dateObj = new Date();
const dayOfWeek = dateObj.getDay();
const offset = 0 - dayOfWeek;

// Loop through all day headers
for (i = 0; i < 14; i++) {

    // Grab all date_header elements and populate them with proper dates
    let dateElement = document.querySelector("#day_" + String(i) + "_header");
    let newDate = addDays(dateObj, i + offset);
    dateElement.innerHTML = getFullDate(newDate);

    /* Figure out what day the header is on and if it is a 0 (Sunday) or 6 (Saturday) 
    then grey out/disable all corresponding boxes */
    let newDateDay = newDate.getDay();
    if (newDateDay == 0 || newDateDay == 6) {
        let weekendElements = document.querySelectorAll(".day_" + String(i));
        weekendElements.forEach(element => {
            element.setAttribute("disabled", true); // Disable button
            element.style.backgroundColor = "#d7d7d7"; // Set it to grey
        })
    }
}

/* End of Bamieh's Code */

// start gronemeier code
// if role is member let them only edit their names row
// function checkRole() {
//     let role = document.querySelector("#role").innerHTML;
//     if (role == "member") {
//         let nameElements = document.querySelectorAll(".name");
//         nameElements.forEach(element => {
//             element.setAttribute("disabled", true);
//             element.style.backgroundColor = "#d7d7d7";
//         })
//     }
// }
// // if role is admin let them see and edit everyone
// function checkRoleAdmin() {
//     let role = document.querySelector("#role").innerHTML;
//     if (role == "admin") {
//         let nameElements = document.querySelectorAll(".name");
//         nameElements.forEach(element => {
//             element.removeAttribute("disabled");
//             element.style.backgroundColor = "white";
//         })
//     }
// }

// ^^ Can't have this code verifying roles client side. Not secure. - Bamieh
// end Gronemeier code

/* Start of Bamieh's code */
const getScheduleData = async () => {
    try {

        // Send POST request to /login and send email/password as JSON in body
        const response = await fetch('/api/schedule', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        // If response is OK then redirect to dashboard else alert user about invalid credentials
        if (response.ok) {
            return await response.json();
        } else {
            alert("Error getting schedule data. Try again.");
        }
    } catch (error) {
        console.error("There was an error fetching dashboard data: ", error);
    }
};

function populateScheduleData(scheduleData) {
    scheduleData.forEach((dataPoint) => {
        console.log(dataPoint);
    });
}

getScheduleData()
    .then((schedule_data) => {
        populateScheduleData(schedule_data);
    });
/* End of Bamieh's code */
