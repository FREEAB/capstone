/* Start of Bamieh's Code */

const Pool = require('pg').Pool;
const bycrpt = require('bcrypt');

// Defining constants
const saltRounds = 10;

// Database connection object
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'capstone',
    password: 'capstone',
    port: 5432,
})

// Connecting to database
pool.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});


/**
 * Function to convert js Date object to something sql can read easily
 * @param {Date} date - This parameter represents the date object you'd like to convert
 * @returns String representation in YYYY-MM-DD
 */
function convertDate(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

/**
 * Function to create a schedule entry for schedule table
 * @param {Number} user_id - This paramater represents the user 
 * @param {Date} date - This paramater represents the date 
 * @param {Number} location_id - This paramater represents the location 
 * @returns whether creation was successful
 */
async function createSchedule(user_id, date, location_id) {
    try {
        const results = pool.query(`INSERT INTO schedule (user_id, date, location_id) VALUES (${user_id}, ${convertDate(date)}, ${location_id});`);
        return results;
    } catch (error) {
        throw error;
    }
}

/**
 * Function to get all schedule entries for certain user
 * @param {Number} user_id - This parameter represents the user
 * @returns all schedule entries for a certain user after a certain date
 */
async function getSchedule(user_id) {
    try {
        const results = pool.query(`SELECT * FROM schedule WHERE user_id = ${user_id};`);
        return results.rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Function to get all schedule entries for certain user after or on a certain date
 * @param {Number} user_id - This parameter represents the user
 * @param {Date} date - This parameter represents the date to search after
 * @returns all schedule entries for a certain user after or on a certain date
 */
async function getScheduleAfterDate(user_id, date) {
    try {
        const results = pool.query(`SELECT * FROM schedule WHERE user_id = ${user_id} AND date >= ${convertDate(date)};`);
        return results.rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Function to get all schedule entries between two dates INCLUSIVE-INCLUSIVE
 * @param {Date} start_date - This parameter represents the start date of the search
 * @param {Date} end_date - This parameter represents the end date of the search
 * @returns all schedule entries for a certain user between two dates
 */
async function getScheduleBetweenDates(start_date, end_date) {
    try {
        const results = await pool.query(`SELECT last_name, schedule.date, location_id
        FROM schedule
        JOIN user_data
        ON schedule.user_id = user_data.id
        WHERE date > '${convertDate(start_date)}'
        AND date <= '${convertDate(end_date)}';`);
        return results.rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Function to update a schedule entries location provided you have user_id and date
 * @param {Number} user_id - This parameter represents the user
 * @param {Date} date - This parameter represents the date of the entry
 * @param {Date} location_id - This parameter represents the new location_id you want for the entry
 * @returns whether update was successful
 */
async function updateSchedule(user_id, date, location_id) {
    try {
        const results = pool.query(`UPDATE schedule SET location = ${location_id} WHERE user_id = ${user_id} AND date = ${convertDate(date)};`)
        return results;
    } catch (error) {
        throw error;
    }
}

/**
 * Function to delete a schedule entry location provided you have user_id and date
 * @param {Number} user_id - This parameter represents the user
 * @param {Date} date - This parameter represents the date of the entry
 * @returns whether delete was successful
 */
async function deleteScheduleEntry(user_id, date) {
    try {
        const results = pool.query(`DELETE * FROM schedule WHERE user_id = ${user_id} AND date = ${convertDate(date)};`);
        return results;
    } catch (error) {
        throw error;
    }
}

/**
 * Function to delete all schedule entries for certain user
 * @param {Number} user_id - This parameter represents the user
 * @returns whether delete was successful
 */
async function deleteScheduleEntries(user_id) {
    try {
        const results = pool.query(`DELETE * FROM schedule WHERE user_id = ${user_id};`);
        return results;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createSchedule,
    getSchedule,
    getScheduleAfterDate,
    getScheduleBetweenDates,
    updateSchedule,
    deleteScheduleEntries,
    deleteScheduleEntry
};

/* End of Bamieh's Code */