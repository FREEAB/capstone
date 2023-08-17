/* Start of Carrasco's Code */

const Pool = require('pg').Pool;

// Database connection object
const pool = new Pool({
    user: 'capstone_og6v_user',
    host: 'oregon-postgres.render.com',
    database: 'capstone_og6v',
    password: 'hK4qNXlWITTsLjU55fIlDYBHQuZI9xiw',
    port: 5432,
    ssl: true,
})

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'capstone',
//     password: 'capstone',
//     port: 5432,
// })

//Function to run query and properly close connection afterwards
async function runQuery(queryString) {
    let results;
    try {
        const dataConnection = await pool.connect();
        const results = await dataConnection.query(queryString);
        await dataConnection.release();
        return results;
    } catch (err) {
        console.log(err);
    }
}

/**Function to return all users from with certain supervisor_id
* @param {Number} id - - This parameter represents the ID of whatever user your trying to find
* @returns a list of troop objects that have the same supervisor_i
*/
async function createSupervisor(supervisor_id, troop_id) {
    try {
        const results = await runQuery(`INSERT INTO supervises (supervisor_id, troop_id) VALUES (${supervisor_id}, ${troop_id});`);
        return results;
    } catch (error) {
        throw error;
    }
};

/**Function to return all users from with certain supervisor_id
* @param {Number} id - - This parameter represents the ID of whatever user your trying to find
* @returns a list of troop objects that have the same supervisor_i
*/
async function getTroopBySupervisorID(id) {
    try {
        const results = await runQuery(`SELECT troop_id FROM supervises WHERE supervisor_id = '${id}';`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

/**Function to return all users from with certain supervisor_id
* @param {Number} id - - This parameter represents the ID of whatever user your trying to find
* @returns a list of troop objects that have the same supervisor_i
*/
async function getTroopBySupervisorID(id) {
    try {
        const results = await runQuery(`SELECT troop_id FROM supervises WHERE supervisor_id = '${id}';`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

/** 
* Function to return a supervisor with certain troop_id
* @param {Number} id - - This parameter represents the ID of whatever user your trying to find
* @returns a supervisor object for a specific troop_id
*/
async function getSupervisorByTroopID(id) {
    try {
        const results = await runQuery(`SELECT supervisor_id FROM supervises WHERE troop_id = '${id}';`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

/** Function to delete a troop with certain troop_id
* @param {Number} id - This parameter represents the ID of whatever user your trying to find
*/
async function deleteTroopByid(id) {
    try {
        const results = await runQuery(`DELETE * FROM supervises WHERE troop_id = '${id}';`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

/** Function to delete a supervisor with certain supervisor_id
* @param {Number} id - This parameter represents the ID of whatever user your trying to find
*/
async function deleteSupervisorByid(id) {
    try {
        const results = await runQuery(`DELETE FROM supervises WHERE supervisor_id = '${id}';`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

/** Function to update a supervisor with certain supervisor_id
* @param {Number} sid - - This parameter represents the ID of whatever user your trying to update
* @param {Number} id - - this parameter represents the value of the updated supervisor_id
*/
async function updateSupervisorByid(id, sid) {
    try {
        const results = await runQuery(`UPDATE supervises SET supervisor_id = ${sid} WHERE supervisor_id = '${id}';`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

/**Function to update a troop with certain troop_id
* @param {Number} tid - - This parameter represents the ID of whatever user your trying to update
* @param {Number} id - - this parameter represents the value of the updated troop_id
*/
async function updateTroopByid(id, tid) {
    try {
        const results = await runQuery(`UPDATE supervises SET troop_id = ${tid} WHERE troop_id = '${id}';`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

// Export functions above
module.exports = {
    createSupervisor,
    getTroopBySupervisorID,
    getSupervisorByTroopID,
    deleteTroopByid,
    deleteSupervisorByid,
    updateSupervisorByid,
    updateTroopByid

};

/* End of Carrasco's Code */