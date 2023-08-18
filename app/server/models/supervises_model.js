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
});

// // Database connection object
// const pool = new Pool({
//     user: 'postgres',
//     host: '192.168.0.239',
//     database: 'postgres',
//     password: 'capstone',
//     port: 5432,
// })

// Connecting to database
pool.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

/**Function to return all users from with certain supervisor_id
* @param {Number} id - - This parameter represents the ID of whatever user your trying to find
* @returns a list of troop objects that have the same supervisor_i
*/
async function getTroopBySupervisorID(id) {
    try {
        const results = await pool.query(`SELECT troop_id FROM supervises WHERE supervisor_id = ANY('${id}');`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

/**Function to return all users from with certain supervisor_id
* @param {Number} id - - This parameter represents the ID of whatever user your trying to find
* @returns a list of troop objects that have the same supervisor_i
*/
async function getsupervisorT() {
    try {
        const results = await pool.query(`SELECT * FROM supervises;`);
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
        const results = await pool.query(`SELECT supervisor_id FROM supervises WHERE troop_id = '${id}';`);
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
        const results = await pool.query(`DELETE * FROM supervises WHERE troop_id = '${id}';`);
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
        const results = await pool.query(`DELETE * FROM supervises WHERE supervior_id = '${id}';`);
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
        const results = await pool.query(`UPDATE supervises SET supervisor_id = ${sid} WHERE supervisor_id = '${id}';`);
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
        const results = await pool.query(`UPDATE supervises SET troop_id = ${tid} WHERE troop_id = '${id}';`);
        return results.rows;
    } catch (error) {
        throw error;
    }
};

// Export functions above
module.exports = {

    getTroopBySupervisorID,
    getSupervisorByTroopID,
    deleteTroopByid,
    deleteSupervisorByid,
    updateSupervisorByid,
    updateTroopByid,
    getsupervisorT

};

/* End of Carrasco's Code */