const dummyModel = require('./models/dummyModel');

const authenticateUser = (req, res, next) => {

    const { email, password } = req.body;

    //checking if user exists in the database by their email
    const user = dummyModel.getUserByEmail(email);
}