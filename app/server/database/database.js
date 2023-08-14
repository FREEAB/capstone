//carrasco's code
//Databse connection odject
const Pool = require('pg').Pool;
const passwordTools = require('../scripts/passwordTools');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'capstone',
    port: 5432,
})
pool.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

//Function to get all users
async function getUsers() {
    try {
        const results = await pool.query("SELECT * FROM user_data;");
        return results.rows;
    } catch (error) {
        throw error;
    }
};

//Function to get user by ID
async function getUserByID(id) {
    try {
        const results = await pool.query(`SELECT * FROM user_data WHERE uid = ${id};`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

//Function to get user by email
async function getUserByEmail(email) {
    try {
        const results = await pool.query(`SELECT * FROM user_data WHERE email = '${email}';`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

//Function to add a new user
const createUser = (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword =

        pool.query('INSERT INTO user_table (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password], (error, results) => {
            if (error) {
                throw error
            }
            res.status(201).send(`User added with ID: ${results.rows[0].id}`)
        })
}
//Function to update data in an existing user
const updateUser = (req, res) => {

    const { name, email, password, id } = req.body

    pool.query(
        'UPDATE user_table SET name = $1, email = $2, password = $3 WHERE user_id = $4',
        [name, email, password, id],
        (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`User modified with ID: ${id}`)
        }
    )
}
//Function delete user
const deleteUser = (req, res) => {
    const id = req.body

    pool.query('DELETE FROM user_table WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUsers,
    getUserByID,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
}
//carrasco's code