'use strict';

exports.cors = function(req, res, next) {
    // This is for the CORS stuff so that people can request data via AJAX
    // on different domains
    // This is particularly necessary for the AngularJS frontend

    // Allow anyone to get data regardless of domain
    res.header('Access-Control-Allow-Origin', '*');
    // Allow any of the supported methods (Options is for the preflight check)
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    // Allow the check for the origin policy
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin');

    // If it's a preflight check, let the user know that they are good to go
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
};
