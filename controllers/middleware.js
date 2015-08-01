'use strict';

// Log Client IP Addresses to the Console
exports.logEverything = function(req, res, next) {
    console.log('Client request from ' + req.ip);
    next();
};
