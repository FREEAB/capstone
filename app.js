/* Start of Bamieh's Code */

// Importing express and creating app object
const express = require('express');
const app = express();

// Importing necessary libraries
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { authenticateToken, authenticateSupervisor, authenticateAdministrator } = require('./middleware/authenticator.js');
const date_functions = require('./dates.js');
const Bree = require('bree');
const saltRounds = 10
// Setting express's view engine to process ejs vs standard HTML allowing dynamic templating
app.set('view engine', 'ejs');

// Database model connection object 
const userDatabase = require('./models/user_model.js');
const scheduleDatabase = require('./models/schedule_model.js');
const supervisesDatabase = require('./models/supervises_model.js');
const { sendPasswordEmail } = require('./jobs/email_password_reset.js');

// Setting constant for port, need to use process.env.port or 3000 for WHS purposes
const PORT = process.env.port || 3000;

// Setting middleware
app.set('views', path.join(__dirname, 'views')); // This allows express to look for views in the /views folder
app.use(express.json()); // This allows express to process json sent through response objects
app.use(express.static(path.join(__dirname, '/public'))); // This allows express to look for static (CSS, JS, Images, etc.) files in the /public folder
app.use(cookieParser()); // This allows express to process cookies through the request objects

// Function to clear Auth cookie from broswer cookies (Gronemeier)
function clearAuthCookie(res) {
    res.clearCookie('auth', {
        httpOnly: true,
        maxAge: 0, // Set to 0 to expire the cookie immediately
        path: '/' // Set the path to match the original cookie's path
    });
}

// Function to remove hashed passwords from user data being served to ejs
function removeHashedPassword(userData) {
    userData.forEach(user => {
        delete user['hashed_password'];
    });
    return userData;
}

// Defining route for login page
app.get("/", async (req, res) => {
    res.render("login");
});
app.get("/forgot_password", async (req, res) => {
    res.render("forgot_password")
})

// Defining protected route for dashboard
app.get("/dashboard", authenticateToken, async (req, res) => {
    let user_data = await userDatabase.getUsers();
    user_data = removeHashedPassword(user_data);

    // Get dates for most recent sunday to 2 weeks after
    const today = new Date();
    const offset = today.getDay();

    // Getting start and end date to pass into schedule query
    const start_date = date_functions.addDays(today, offset);
    const end_date = date_functions.addDays(start_date, 28);

    schedule_data = await scheduleDatabase.getScheduleBetweenDates(start_date, end_date);
    res.render("dashboard", { members: user_data, schedule: schedule_data });
});

// Defining route for incoming /create requests (Carrasco)
app.get("/create", authenticateAdministrator, async (req, res) => {
    res.render("create");
});

// Defining route for settings page
app.get("/settings", authenticateSupervisor, async (req, res) => {

    // Getting payload from token
    const payload = jwt.verify(req.cookies.auth, process.env.secret);
    let user_data = await userDatabase.getUserBelowRole(payload.role);

    // Getting user data and removing hashed passwords before serving to ejs as well as filtering out current user
    user_data = removeHashedPassword(user_data);
    user_data = user_data.filter(user => user.id !== payload.id);

    // Getting troops for population of settings page
    let troops = await supervisesDatabase.getTroopBySupervisorID(payload.id);
    troops = removeHashedPassword(troops);

    res.render("settings", { troops: troops, members: user_data });
});

app.get("/change_password", async (req, res) => {
    res.render("change_password")
})


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
                const payload = { id: user.id, role: user.role_id };

                // Sign the payload above with secret key, store it in 'auth' cookie and return successful login
                const token = jwt.sign(payload, process.env.secret);
                res.cookie('auth', token, { httpOnly: true, maxAge: 3600000 }); // This cookie will be httpOnly and have a maxAge of 1 hour (ms)
                return res.status(200).json({ message: "Login Successful." });
            } else {
                // If program makes it here then the credentials were invalid
                res.status(401).json({ message: "Invalid Credentials" });
            }
        }
        // Catch errors going on in server
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/forgot_password', async (req, res) => {
    try {
        
        const { email } = req.body
        const user = await userDatabase.getUserByEmail(email)
        if (user) {
            let newPassword = userDatabase.genPassword()
            userDatabase.resetPassword(user.id, newPassword)
            sendPasswordEmail(user.id, newPassword)
            return res.status(200).json({ message: "Email Sent."})
        } else {
            res.status(401).json({ message: "Invalid Email" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

app.post("/change_password", async (req, res) => {
    try {

        const {email, password} = req.body
        const user = await userDatabase.getUserByEmail(email)
        if (user) {
            let newPassword = password
            userDatabase.resetPassword(user.id, newPassword)
            return res.status(200).json({ message: "Password Changed."})
        } else {
            res.status(401).json({ message: "Invalid Entry" })
        }    
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

//Handling registering attempts (Carrasco)
app.post("/create", authenticateAdministrator, async (req, res) => {
    try {
        //Using destructuring assignment to pull first_name, last_name, email, password, and role
        const { firstName, lastName, email, password, role } = req.body;

        // Inserting data into databse
        const creationResult = await userDatabase.createUser(email, password, firstName, lastName, role);

        // If row's created doesn't equal 0 then registration was successful else return a 500 status
        if (creationResult.rowCount) {
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
app.get("/api/schedule", authenticateToken, async (req, res) => {

    // Will return 2 weeks of schedule data backdated to most recent Sunday
    let today = new Date();
    let offset = -today.getDay();
    let start_date = date_functions.addDays(today, offset-14);
    let end_date = date_functions.addDays(start_date, 28);
    scheduleData = await scheduleDatabase.getScheduleBetweenDates(start_date, end_date);
    res.json(scheduleData);
});

// Defining route to save schedule to database
app.post("/api/schedule", authenticateToken, async (req, res) => {
    const { user_id, date, location_id } = req.body;
    console.log(user_id, date, location_id);
    const results = await scheduleDatabase.createSchedule(user_id, date, location_id);
    res.status(200).json({ message: "Schedule was saved!" });
});

// Defining route to save supervisor settings
app.post("/api/settings", authenticateSupervisor, async (req, res) => {
    const { troops } = req.body;
    // console.log(troops);

    token = req.cookies.auth;
    if (!token) {
        res.status(500).json({ message: "Internal Server Error!" });
    }

    const payload = jwt.verify(token, process.env.secret);
    const user_id = payload.id;

    const results = await supervisesDatabase.deleteSupervisorByid(user_id);

    try {
        for (const troop of troops) {
            await supervisesDatabase.createSupervisor(user_id, troop);
        }
    } catch (err) {
        console.log(err);
    }

    res.status(200).json({ message: "Settings was saved!" });
})

// Defining route to logout of account and delete auth token (Gronemeier)
app.get('/logout', (req, res) => {
    // Clear the auth cookie to remove the token from the client
    clearAuthCookie(res);
    res.clearCookie('auth',);
    console.log("Logout Successful");
    res.redirect('/');
});

// Defining route for incoming requests without valid path
app.get("/*", async (req, res) => {
    res.render("404");
});

// scheduling first notification email (Carrasco)
const bree = new Bree({
    jobs: [{
        name: 'first_notification',
        // interval: '30 seconds'
        cron: '00 09 * * 1-5'
    }]
});
bree.start();

// scheduling second notification email (Carrasco)
const bree2 = new Bree({
    jobs: [{
        name: 'second_notification',
        // interval: '30 seconds',
        cron: '15 09 * * 1-5'
    }]
});
bree2.start();

// Starts listening for incoming requests after everything (middleware, routes, settings) has been setup and defined
app.listen(PORT, () => {
    console.log(`Server listening on localhost:${PORT}`);
});

/* End of Bamieh's Code */