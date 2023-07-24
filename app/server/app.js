//Start of Bamieh's Code
//Importing necessary libraries
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const path = require('path');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');
const dummyData = require('./scripts/dummyDatabase');
const passwordTools = require('./scripts/passwordTools');

//Setting express's view engine to process ejs vs standard HTML allowing dynamic templating
app.set('view engine', 'ejs');

// Database Connection object 
const db = require('./database/database.js')
//carrasco's code
//HTTP request methods
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/create', db.createUser)
app.post('/put', db.updateUser)
app.delete('/users/:id', db.deleteUser)
//Carrasco's code

//Setting middleware
app.set('views', path.join(__dirname, "..", 'views')); //This allows express to look for views in the /views folder
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", '/public'))); //This allows express to look for static (CSS, JS, Images, etc.) files in the /public folder

//Defining first route for incoming requests with no path in the URL
app.get("/", async (req, res) => {
    res.redirect("/login");
});

//Defining route for login
app.get("/login", async (req, res) => {
    res.render("login");
});

//defining route to update user 
app.get("/put", async (req, res) => {
    res.render("put");
});

//defining route to create user
app.get("/create", async (req, res) => {
    res.render("create");
});

//Handling login
app.post('/login', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email, password);
    return res.status(200);
})



//Defining route for incoming requests without a path thats been defined in one of the above routes
app.get("/*", async (req, res) => {
    res.render("404");
});

//Starts listening for incoming requests after everything (middleware, routes, settiings) has been setup and defined
app.listen(3000, () => {
    console.log('Server listening on localhost:3000');
});

//End of Bamieh's Code