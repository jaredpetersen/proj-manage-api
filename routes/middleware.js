var express = require('express');
var router = express.Router();

// Middleware for the API
router.use(function(req, res, next) {

    // Get the client IP address
    // TODO: Look into this further as the API actually goes up on to a real server
    var ip = req.ip;
    // Log the requests in the console
    console.log('Client request from ' + ip);
    next();
})

module.exports = router;
