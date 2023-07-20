//Start of Bamieh's Code

const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Hashes a password.
 * @param {String} plainTextPassword - The password you'd like to hash.
 * @returns {String} Your hashed password
 */
async function hashPassword(plainTextPassword) {
    try {
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        return hashedPassword;
    } catch (err) {
        throw new Error('Error hashing password')
    }
}

/**
 * Compares a plain text password with a hashed password.
 * @param {String} plainTextPassword - The plain text password you'd like to compare.
 * @param {String} hashedPassword - The hashed password you'd like to compare.
 * @returns {Boolean} Whether or not your passwords are equal.
 */
async function comparePasswords(plainTextPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainTextPassword, hashedPassword);
        return match;
    } catch (err) {
        throw new Error('Error comparing passwords');
    }
}

module.exports = { hashPassword, comparePasswords };

//End of Bamieh's Code
