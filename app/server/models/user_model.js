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
        const results = await pool.query(`SELECT * FROM user_data WHERE id = ${id};`);
        return results.rows[0];
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
        return results.rows[0];
    } catch (error) {
        throw error;
    }
};

/**
 * Function to create a user in the user_data table
 * @param {String} email - This parameter represents the email of the new user
 * @param {String} password - This parameter represents the plain_text password of the new user
 * @param {String} first_name - This parameter represents the first name of the new user
 * @param {String} last_name - This parameter represents the last name of the new user
 * @param {Number} role - This parameter represents the role of the new user
 * @returns the results of adding the user
 */
async function createUser(email, password, first_name, last_name, role) {
    try {
        const hashed_password = bcrypt.hash(password, saltRounds);
        const results = await pool.query(`INSERT INTO user_data (email, hashed_password, first_name, last_name) VALUES (${email},${hashed_password},${first_name},${last_name},${role})`);
        return results;
    } catch (error) {
        throw error;
    }
};

/**
 * Function to update a user in the user_data table. All field's except id are optional to input.
 * @param {Number} id - Update this user by their ID
 * @param {String} email - This parameter represents the email of the new user
 * @param {String} password - This parameter represents the plain_text password of the new user
 * @param {String} first_name - This parameter represents the first name of the new user
 * @param {String} last_name - This parameter represents the last name of the new user
 * @param {Number} role - This parameter represents the role of the new user
 * @returns the results of adding the user
 */
async function updateUser(id, email = null, password = null, first_name = null, last_name = null, role = null) {
    try {
        const user = getUserByID(id);
        if (!user) {
            throw error;
        }
        if (!email) { email = user.email }
        if (!first_name) { first_name = user.first_name }
        if (!last_name) { last_name = user.last_name }
        if (!role) { role = user.role }
        if (password) {
            const hashed_password = bcrypt.hash(password, saltRounds);
        } else {
            const hashed_password = user.hashed_password;
        }

        const results = await pool.query(`UPDATE user_data SET email = ${email}, hashed_password = ${hashed_password}, first_name = ${first_name}, last_name = ${last_name}, role = ${role} WHERE id = ${id};`);
        return results;
    } catch (error) {
        throw error;
    }
};

/**
 * 
 * @param {Number} id - Used to locate user in user_data
 * @returns - Whether user was deleted
 */
async function deleteUserByID(id) {
    try {
        const results = await pool.query(`DELETE FROM user_data WHERE id = ${id};`);
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {Number} email - Used to locate user in user_data
 * @returns - Whether user was deleted
 */
async function deleteUserByEmail(email) {
    try {
        const results = await pool.query(`DELETE FROM user_data WHERE email = ${email};`);
    } catch (error) {
        throw error;
    }
}

// Export functions above
module.exports = {
    getUsers,
    getUserByID,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUserByID,
    deleteUserByEmail
};

/* End of Bamieh's Code */
