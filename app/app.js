//Start of Bamieh's Code
//Importing necessary libraries
const express = require('express');
const app = express();

//Setting express's view engine to process ejs vs standard HTML allowing dynamic templating
app.set('view engine', 'ejs');

//Setting middleware
app.use(express.static(__dirname + '/public')); //This allows express to look for static (CSS, JS, Images, etc.) files in the /public folder




//Defining first route for incoming requests with no path in the URL
app.get("/", async (req, res) => {
    res.render("index");
});

//Defining route for incoming requests without a path thats been defined in one of the above routes
app.get("/*", async (req, res) => {
    res.render("404");
});

//Starts listening for incoming requests after everything (middleware, routes, settiings) has been setup and defined
app.listen(3000, () => {
    console.log('Server listening on 3000');
});

//End of Bamieh's Code