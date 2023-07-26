/* Start of Bamieh's Code */

// Importing express and creating app object
const express = require('express');
const app = express();

// Importing necessary libraries
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const middleware = require('./middleware/authenticator');

// Setting express's view engine to process ejs vs standard HTML allowing dynamic templating
app.set('view engine', 'ejs');

// Database model connection object 
const db = require('./models/user_model.js');

// Setting middleware
app.set('views', path.join(__dirname, "..", 'views')); // This allows express to look for views in the /views folder
app.use(express.json()); // This allows express to process json sent through response objects
app.use(express.static(path.join(__dirname, "..", '/public'))); // This allows express to look for static (CSS, JS, Images, etc.) files in the /public folder
app.use(cookieParser()); // This allows express to process cookies through the request objects

// Defining route for login page
app.get("/", async (req, res) => {
    res.render("login");
});

// Handling login attempts 
app.post('/login', async (req, res) => {
    try {

        // Using destructuring assignment to pull email and password off of req.body
        const { email, password } = req.body;

        // Try to find a user using the email put in
        const user = await db.getUserByEmail(email);

        if (user) {
            // If there is a user for the email then get their hashed password and compare it to the input password
            const hashedPassword = user[0].password;
            const passwordValid = await bcrypt.compare(password, hashedPassword);
            console.log(passwordValid);

            if (passwordValid) {

                // Create an object with user's uid and email
                const payload = { id: user[0].uid, email: user[0].email };

                // Sign the payload above with secret key, store it in 'auth' cookie and return successful login
                const token = jwt.sign(payload, process.env.SECRET);
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

//Defining protected route for dashboard
app.get("/dashboard", middleware.authenticateToken, async (req, res) => {
    res.render("dashboard");
})

// Defining route for incoming requests without valid path
app.get("/*", async (req, res) => {
    res.render("404");
});

// Starts listening for incoming requests after everything (middleware, routes, settiings) has been setup and defined
app.listen(3000, () => {
    console.log('Server listening on localhost:3000');
});

/* End of Bamieh's Code */