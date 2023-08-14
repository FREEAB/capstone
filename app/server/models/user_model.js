/* Start of Bamieh's Code */

const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');

// Defining constants
const saltRounds = 10;

// Database connection object
const pool = new Pool({
    user: 'postgres',
    host: '10.10.20.37',
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
 
Function to return email of user with certain id
@param {Number} id - This parameter represents the ID of whatever user your trying to find
@returns a list of user objects with the given ID
*/
async function getUserEmailByID(id) {
    try {
        const results = await pool.query(`SELECT email FROM user_data WHERE id = ${ id };`);
        return results.rows[0];
    } catch (error) {
        throw error;
    }
};

/**
 
Function to return email of user with role id
@param {Number} id - This parameter represents the ID of whatever user your trying to find
@returns a list of user objects with the given ID
*/
async function getUserEmailByRoleID(id) {
    try {
        const results = await pool.query(`SELECT email FROM user_data WHERE role_id = ${ id };`);
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

        // Password should be in plain text so hash it and then insert it along with everything else
        const hashed_password = await bcrypt.hash(password, saltRounds);
        const results = await pool.query(`INSERT INTO user_data (email, hashed_password, first_name, last_name, role_id) VALUES ('${email}','${hashed_password}','${first_name}','${last_name}',${role})`);

        console.log("user was created");
        return results;
    } catch (error) {
        console.log("Error was thrown in user_Model.createUser");
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

        // Try to find the user by their ID and if they don't exist then throw an error
        const user = getUserByID(id);
        if (!user) {
            throw error;
        }

        // If these parameters null (Something wasn't input for them) then set them equal to their current values by using the 'user' object
        if (!email) { email = user.email }
        if (!first_name) { first_name = user.first_name }
        if (!last_name) { last_name = user.last_name }
        if (!role) { role = user.role }

        // If anything for password is input, then hash it
        if (password) {
            const hashed_password = bcrypt.hash(password, saltRounds);
            // If nothing input for password, then set it equal to the current hashed_password value for the user
        } else {
            const hashed_password = user.hashed_password;
        }

        // Update all the values with the values we got
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
    deleteUserByEmail,
    getUserEmailByID,
    getUserEmailByRoleID
};

/* End of Bamieh's Code */
