/* Start of Carrasco's Code */

// Getting runQuery function from pool.js (Bamieh)
const { runQuery } = require('./pool.js');

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