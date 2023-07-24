//carrasco's code
//Databse connection odject
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Capstone',
    password: 'Nene3443',
    port: 3000,
})
pool.connect(function (err) {
    if (err) throw err;
    console.log(" Database Connected!");
});
//Function to get all users
const getUsers = (req, res) => {
    pool.query('SELECT * FROM user_table ORDER BY user_id', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

//Function to get single user by id
const getUserById = (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('SELECT * FROM user_table WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

//Function to add a new user
const createUser = (req, res) => {
    const { name, email, password } = req.body

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
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}
//carrasco's code