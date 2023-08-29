/* Start of Bamieh's Code */

// Importing Modules
const Pool = require('pg').Pool;

// Database connection object for Render hosted database
const whs_pool = new Pool({
    user: 'capstone_og6v_user',
    host: 'oregon-postgres.render.com',
    database: 'capstone_og6v',
    password: 'hK4qNXlWITTsLjU55fIlDYBHQuZI9xiw',
    port: 5432,
    ssl: true,
})

// Database connection object for local hosted database
const local_pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'capstone',
    password: 'Vikkstar123',
    port: 5432,
})

//Function to run query and properly close connection afterwards
async function runQuery(queryString) {
    try {
        const dataConnection = await local_pool.connect();
        const results = await dataConnection.query(queryString);
        await dataConnection.release();
        return results;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    runQuery
}

/* End of Bamieh's Code */