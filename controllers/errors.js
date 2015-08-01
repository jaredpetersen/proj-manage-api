'use strict';

// Handle all of the errors
exports.errorHandler = function(err, req, res, next) {
    // Check for the various error statuses
    if (err.status == 400 || err.code == 'ER_BAD_NULL_ERROR') {
        res.json({ "message": "Bad Request" });
    }
    else if (err.status == 404) {
        res.json({ "message": "Not Found" });
    }
    else {
        res.status(500).json({ "message": "Internal Server Error" });
    }
};
