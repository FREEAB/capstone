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
 * @returns - String representation of date object (Friday 4 August)
 */
function getFullDate(date) {
    let dayName = date.toLocaleString('default', { weekday: 'long' });
    let month = date.toLocaleString('default', { month: 'long' });
    let day = date.getDate();
    return (String(dayName) + " " + String(day) + " " + String(month));
}

/**
 * @param {Date} date - Date object you'd like to print
 * @returns - String representation of date object (2023-12-25)
 */
function getNumericDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return (String(year) + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0"));
}

/**
 * 
 * @returns JSON object of all scheduling data from most recent sunday to 2 weeks later
 */
async function getScheduleData() {
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

/**
 * 
 * @param {Object} scheduleData - Should be a json object with schedule data in it (last_name, date, location_id)
 * @returns - Returns nothing but populates all appropriate dropdown boxes with scheduling data
*/
function populateScheduleData(scheduleData) {
    scheduleData.forEach((entry) => {
        const entry_name = entry.last_name;
        const entry_date = entry.date.substring(0, 10);
        const entry_day = dayMappings[entry_date];
        const entry_location = entry.location_id;
        // console.log(dayMappings);
        // console.log(entry_name, entry_date, entry_location);
        // console.log();
        element = document.querySelector(`#${entry_name}_day_${entry_day}_dropdown`);
        if (element) {
            element.selectedIndex = entry_location;
            element.dispatchEvent(new Event('change'));
            console.log('it worked');
        }
    });
}

// Defining necessary variables
const dateObj = new Date();
const dayOfWeek = dateObj.getDay();
const offset = 0 - dayOfWeek;
const dayMappings = {};

// Loop through all day headers
for (let i = 0; i < 14; i++) {

    // Grab all date_header elements and populate them with proper dates
    let dateElement = document.querySelector("#day_" + String(i) + "_header");
    let newDate = addDays(dateObj, i + offset);
    // dateElement.id = `${getNumericDate(newDate)}_header`;
    dateElement.innerHTML = getFullDate(newDate);
    dayMappings[getNumericDate(newDate)] = i;

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

getScheduleData()
    .then((schedule_data) => {
        populateScheduleData(schedule_data);
    });

// const dropdowns = document.querySelectorAll('.dropcolors')
// dropdowns.forEach((dropdown) => {
//     dropdown.addEventListener('change', (event) => {
//         // get id of dropdown
//         const id = event.target.id;
//         // get value of dropdown
//         const value = event.target.value;
//         // get day of dropdown
//         const day = id.split("_")[2];
//         // get user id of dropdown
//         const user_name = id.split("_")[0];
//         // send data to server
//         fetch('/dashboard', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 user_id: user_id,
//                 day: day,
//                 value: value
//             })
//         }).then((response) => {
//             return response.json();
//         }).then((data) => {
//             console.log(data);
//         });
//     });
// });
/* End of Bamieh's code */
