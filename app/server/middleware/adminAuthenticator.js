/* Start of Bamieh's Code */
const jwt = require('jsonwebtoken');

// Requiring dotenv for secret keys
require('dotenv').config();

/** 
 * Middleware to authenticate token
 * @param {Request} req - This parameter represents the request object.
 * @param {Response} res - This parameter represents the response object.
 * @param {Function} next - This parameter represents the function to pass control to after your middleware has done its job.
 * @returns {Response} Will return a redirect response if token is nonexistent/invalid.
 */
const adminAuthenticateToken = (req, res, next) => {

    // Grabbing token from request object cookies
    const token = req.cookies.auth;

    if (!token) {
        return res.redirect("/")
    }

    // Verifying token is accurate and then extracting payload to pass onto next request
    jwt.verify(token, process.env.secret, (err, payload) => {
        if (err) {
            return res.redirect("/");
        }
        
        req.role = payload.role
        const role = payload.role ;
        if (role != 3) { 
            res.status(401).json({ message: "invalid Authorization" });
            return res.redirect("/dashboard")
        }
        req.user_id = payload.id;
        next()
    });

}

module.exports = { adminAuthenticateToken };
/* End of Bamieh's Code */