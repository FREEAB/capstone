/* Start of Carrasco's Code */

const Pool = require('pg').Pool;

// Database connection object
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'capstone',
    password: 'transfer25',
    port: 5432,
})

// Connecting to database
pool.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

/* End of Carrasco's Code */

/* Start of Bamieh's Code (Carrasco is responsible for all SQL Queries */

/**
 * Function to return all users from user_data table
 * @returns a list of user objects that include (uid, email, hashed_password)
 */
async function getUsers() {
    try {
        const results = await pool.query("SELECT * FROM user_data;");
        return results.rows;
    } catch (error) {
        throw error;
    }
};

/**
 * Function to return all users from with certain id
 * @param {Number} id - This parameter represents the ID of whatever user your trying to find
 * @returns a list of user objects with the given ID
 */
async function getUserByID(id) {
    try {
        const results = await pool.query(`SELECT * FROM user_data WHERE uid = ${id};`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

/**
 * Function to return all users from with certain id
 * @param {String} email - This parameter represents the emali of whatever user your trying to find
 * @returns a list of user objects with the given email
 */
async function getUserByEmail(email) {
    try {
        const results = await pool.query(`SELECT * FROM user_data WHERE email = '${email}';`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

// Export functions above
module.exports = {
    getUsers,
    getUserByID,
    getUserByEmail
};

/* End of Bamieh's Code */
