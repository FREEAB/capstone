//carrasco's code
//Databse connection odject
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'capstone',
    password: 'transfer25',
    port: 5432,
});

pool.connect(function (err) {
    if (err) throw err;
    console.log(" Database Connected!");
});

//Function to get all users
const getUsers = (req, res) => {
    pool.query('SELECT * FROM user_data', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

//Function to get single user by id
const getUserById = (req, res) => {
    const id = 1;

    pool.query('SELECT * FROM user WHERE uid = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

//Function to add a new user
const createUser = (req, res) => {
    const { email, password } = req.body

    pool.query('INSERT INTO user ( email, password) VALUES ($1, $2) RETURNING *', [email, password], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
}
//Function to update data in an existing user
const updateUser = (req, res) => {
    const id = parseInt(req.params.id)
    const { name, email, password } = req.body

    pool.query(
        'UPDATE user SET email = $2, password = $3 WHERE uid = $4',
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
    const id = parseInt(req.params.id)

    pool.query('DELETE FROM user WHERE uid = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}
//carrasco's code