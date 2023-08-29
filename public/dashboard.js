/* Start of Bamieh's Code ( Color mappings were chosen by Gronemeier ) */

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
        const entry_id = entry.user_id;
        const entry_date = entry.date.substring(0, 10);
        // const entry_day = dayMappings[entry_date];
        const entry_location = entry.location_id;
        element = document.querySelector(`#dropdown_${entry_id}_${entry_date}`);
        if (element) {
            element.selectedIndex = entry_location;
            element.dispatchEvent(new Event('change'));
        }
    });
}

// Defining necessary variables
const dateObj = new Date();
const dayOfWeek = dateObj.getDay(); // Day of week 0 = Sunday | 6 = Saturday
const offset = -dayOfWeek; // This number tells you how many days till most recent sunday
const dayMappings = {}; // Used to translate day 1-14 of the calendar to actual dates
var isInitialPopulation = true; // Used to avoid duplication of data
const colorMappings = {
    "0": "rgb(255,255,255)",
    "1": "rgb(135,206,235)",
    "2": "rgb(237,221,119)",
    "3": "rgb(227,143,242)",
    "4": "rgb(237,100,100)",
    "5": "rgb(59, 163, 92)",
    "6": "rgb(227,133, 61)"
};

// Loop through all days (1-14) on calendar to set proper headers and disable weekends
for (let i = 0; i < 28; i++) {

    // Grab all day_x_header elements and populate them with proper dates (x refers to day 0-14)
    let dateElement = document.querySelector("#day_" + String(i) + "_header");

    // This will return a new date object using offset var which on i=0 will return the most recent sunday
    let newDate = addDays(dateObj, i + offset);

    // Setting proper headers and assigning proper day-date mappings to dayMappings
    dateElement.innerHTML = getFullDate(newDate);
    dayMappings[i] = getNumericDate(newDate);

    // Disable & gray out dropdowns if day of week is 0 (Sun) or 6 (Sat)
    let newDateDay = newDate.getDay();
    if (newDateDay == 0 || newDateDay == 6) {
        let weekendElements = document.querySelectorAll(".day_" + String(i));
        weekendElements.forEach(element => {
            element.setAttribute("disabled", true); // Disable dropdown
            element.style.backgroundColor = "#d7d7d7"; // Set it to gray
        })
    }
}

// Retrieves Schedule data from database and then populates all appropriate dropdowns
getScheduleData()
    .then((schedule_data) => {
        populateScheduleData(schedule_data);
        isInitialPopulation = false; // Sets this to false so any further changes will be saved in db
    });

// Loop through every dropdown
const dropdowns = document.querySelectorAll('.dropcolors');
dropdowns.forEach((dropdown) => {

    // Converts dropdown IDs from 'X_dropdown_Y' to 'dropdown_X_YYYY-MM-DD
    let dropdownID = dropdown.id.split("_")[0];
    let dropdownDay = dropdown.id.split("_")[2];
    let dropdownDate = dayMappings[dropdownDay];
    dropdown.id = `dropdown_${dropdownID}_${dropdownDate}`;

    // Make event listener for changes to change colors and save changes to db
    dropdown.addEventListener('change', (event) => {
        const dropdownValue = event.target.value;
        event.target.style.backgroundColor = colorMappings[dropdownValue];

        // If this isn't the initial population then save to db
        if (!isInitialPopulation) {
            const dropdownID = event.target.id.split("_")[1];
            const dropdownDate = event.target.id.split("_")[2];
            const dropdownValue = event.target.value;

            // Simple POST request to /api/schedule with user_id, date, location_id in body
            fetch('/api/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: dropdownID,
                    date: dropdownDate,
                    location_id: dropdownValue
                })
            }).then((response) => {
                if (response.ok) {
                    console.log("Change was saved");
                } else {
                    console.error(response);
                }
                return response.json();
            })
        }
    });
});
/* End of Bamieh's code */
