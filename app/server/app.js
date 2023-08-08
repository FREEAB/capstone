/* Start of Bamieh's Code (/create route made my Carrasco) */

// Importing express and creating app object
const express = require('express');
const app = express();

// Importing necessary libraries
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const middleware = require('./middleware/authenticator');
const date_functions = require('./dates.js');

// Setting express's view engine to process ejs vs standard HTML allowing dynamic templating
app.set('view engine', 'ejs');

// Database model connection object 
const userDatabase = require('./models/user_model.js');
const scheduleDatabase = require('./models/schedule_model.js');

// Setting middleware
app.set('views', path.join(__dirname, "..", 'views')); // This allows express to look for views in the /views folder
app.use(express.json()); // This allows express to process json sent through response objects
app.use(express.static(path.join(__dirname, "..", '/public'))); // This allows express to look for static (CSS, JS, Images, etc.) files in the /public folder
app.use(cookieParser()); // This allows express to process cookies through the request objects

// Defining route for login page
app.get("/", async (req, res) => {
    res.render("login");
});

//Defining protected route for dashboard
app.get("/dashboard", async (req, res) => {
    user_data = await userDatabase.getUsers();

    // Get dates for most recent sunday to 2 weeks after
    let today = new Date();
    let offset = -today.getDay();

    // Getting start and end date to pass into schedule query
    let start_date = date_functions.addDays(today, offset);
    let end_date = date_functions.addDays(start_date, 14);

    schedule_data = await scheduleDatabase.getScheduleBetweenDates(start_date, end_date);
    res.render("dashboard", { members: user_data, schedule: schedule_data });
});

//Defining route for incoming /create requests
app.get("/create", async (req, res) => {
    res.render("create", datab);
});

// Defining route to validate login attempt
app.post('/login', async (req, res) => {
    try {

        // Using destructuring assignment to pull email and password off of req.body
        const { email, password } = req.body;

        // Try to find a user using the email put in
        const user = await userDatabase.getUserByEmail(email);
        if (user) {
            // If there is a user for the email then get their hashed password and compare it to the input password
            const hashedPassword = user.hashed_password;
            const passwordValid = await bcrypt.compare(password, hashedPassword);
            if (passwordValid) {

                // Create an object with user's id and email
                const payload = { id: user.id, email: user.email };

                // Sign the payload above with secret key, store it in 'auth' cookie and return successful login
                const token = jwt.sign(payload, process.env.secret);
                res.cookie('auth', token, { httpOnly: true, maxAge: 3600000 }); // This cookie will be httpOnly and have a maxAge of 1 hour (ms)
                return res.status(200).json({ message: "Login Successful." });
            }
        }
        // Catch errors going on in server
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
    // If program makes it here then the credentials were invalid
    res.status(401).json({ message: "Invalid Credentials" });
});

//Handeling registering attempts
app.post("/create", async (req, res) => {
    try {

        //Using destructuring assignment to pull first_name, last_name, email, password, and role
        const { firstName, lastName, email, password, secretKey, role } = req.body;

        // Validate secret key for chosen role


        // Inserting data into databse
        const creationResult = await userDatabase.createUser(email, password, firstName, lastName, role);

        // Getting ID from new user
        const newUser = await userDatabase.getUserByEmail(email);
        const newUserID = newUser.id;

        if (creationResult.rowCount) {

            //Create an object with user's id and email
            const payload = { id: newUserID, email: email };

            // Sign the payload above with secret key, store it in 'auth' cookie and return successful registration
            const token = jwt.sign(payload, process.env.secret);
            res.cookie('auth', token, { httpOnly: true, maxAge: 3600000 }); // This cookie will be httpOnly and have a maxAge of 1 hour (ms)
            return res.status(200).json({ message: "Registration Successful." });

        } else {
            return res.status(500).json({ message: "Database error" });
        }

    }
    // Catch errors going on in server
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }

});

// Defining route to get schedule data
app.get("/api/schedule", async (req, res) => {

    // Will return 2 weeks of schedule data backdated to most recent Sunday
    let today = new Date();
    let offset = -today.getDay();
    let start_date = date_functions.addDays(today, offset);
    let end_date = date_functions.addDays(start_date, 14);
    scheduleData = await scheduleDatabase.getScheduleBetweenDates(start_date, end_date);
    res.json(scheduleData);
});

// Defining route to save schedule to database
app.post("/api/schedule", async (req, res) => {
    const { user_id, date, location_id } = req.body;
    console.log(user_id, date, location_id);
    const results = await scheduleDatabase.createSchedule(user_id, date, location_id);
    res.status(200).json({ message: "Schedule was saved!" });
});

// Defining route for incoming requests without valid path
app.get("/*", async (req, res) => {
    res.render("404");
});

// Starts listening for incoming requests after everything (middleware, routes, settings) has been setup and defined
app.listen(3000, () => {
    console.log('Server listening on localhost:3000');
});

/* End of Bamieh's Code */