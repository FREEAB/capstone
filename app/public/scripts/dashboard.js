const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function addDays(date, days) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() + days);
    return dateCopy;
}

function getFullDate(date) {
    let month = date.getMonth()+1;
    let day = date.getDate();
    return (String(month) + "-" + String(day));
}

for (i = 1; i < 15; i++) {
    let dateElement = document.querySelector("#day_" + String(i) + "_header");
    const dateObj = new Date();
    dateElement.innerHTML = getFullDate(addDays(dateObj, i - 1));
}

