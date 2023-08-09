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

module.exports = { addDays, getFullDate };