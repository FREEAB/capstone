function addDays(date, days) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() + days);
    return dateCopy;
}

function getFullDate(date) {
    let dayName = date.toLocaleString('default', { weekday: 'long' });
    let month = date.toLocaleString('default', { month: 'long' });
    let day = date.getDate();
    return (String(dayName) + " " + String(day) + " " + String(month));
}

// for (i = 0; i < 14; i++) {
//     let dateElement = document.querySelector("#day_" + String(i) + "_header");
//     const dateObj = new Date();
//     dateElement.innerHTML = getFullDate(addDays(dateObj, i - 1));
// }

const dateObj = new Date();

const dayOfWeek = dateObj.getDay();

const offset = 0 - dayOfWeek;



for (i = 0; i < 14; i++) {
    let dateElement = document.querySelector("#day_" + String(i) + "_header");
    let newDate = addDays(dateObj, i + offset);
    let newDateDay = newDate.getDay();
    dateElement.innerHTML = getFullDate(newDate);

    if (newDateDay == 0 || newDateDay == 6) {
        let weekendElements = document.querySelectorAll(".day_" + String(i));
        weekendElements.forEach(element => {
            element.setAttribute("disabled", true);
            element.style.backgroundColor = "#d7d7d7";
            })
    }
}

// start gronemeier code
// if role is member let them only edit their names row
function checkRole() {
    let role = document.querySelector("#role").innerHTML;
    if (role == "member") {
        let nameElements = document.querySelectorAll(".name");
        nameElements.forEach(element => {
            element.setAttribute("disabled", true);
            element.style.backgroundColor = "#d7d7d7";
        })
    }
}
// if role is admin let them see and edit everyone
function checkRoleAdmin() {
    let role = document.querySelector("#role").innerHTML;
    if (role == "admin") {
        let nameElements = document.querySelectorAll(".name");
        nameElements.forEach(element => {
            element.removeAttribute("disabled");
            element.style.backgroundColor = "white";
        })
    }
}

// if role is supervisor let them edit theirs and their troops dropdowns
function checkRoleSupervisor() {
    let role = document.querySelector("#role").innerHTML;
    if (role == "supervisor") {
        let nameElements = document.querySelectorAll(".name");
        nameElements.forEach(element => {
            element.removeAttribute("disabled");
            element.style.backgroundColor = "white";
        })
    }
}

// end Gronemeier code
