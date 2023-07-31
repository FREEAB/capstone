function addDays(date, days) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() + days);
    return dateCopy;
}

function getFullDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    return (String(month) + "-" + String(day) + "-" + String(year));
}

for (i = 1; i < 15; i++) {
    let dateElement = document.querySelector("#day_" + String(i) + "_header");
    const dateObj = new Date();
    dateElement.innerHTML = getFullDate(addDays(dateObj, i - 1));
}

