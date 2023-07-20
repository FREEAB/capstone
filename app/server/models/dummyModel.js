const dummyData = require('./scripts/dummyDatabase');

function getUserByEmail(email) {
    return dummyData.dummyDatabase.find((user) => user.email === email);
}