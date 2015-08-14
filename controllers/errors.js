'use strict';

// Handle all of the errors
exports.errorHandler = function(err, req, res, next) {
    // Check for the various error statuses
    if (err.status == 400 ||
        err.code == 'ER_BAD_NULL_ERROR' ||
        err.code == 'ER_NO_REFERENCED_ROW_2') {
        res.status(400).json({"message": "Bad Request"});
    }
    else if (err.status == 404) {
        res.status(404).json({"message": "Not Found"});
    }
    else if (err.status == 401) {
        res.status(401).json({"message": "User Authentication Failed!"});
    }
    else {
        res.status(500).json({"message": "Internal Server Error"});
    }
};

/* List of the error codes being checked
   ER_BAD_NULL_ERROR -- User did not give all of the required parameters
   ER_NO_REFERENCED_ROW_2 -- User gave a foreign key value that does not exist
*/
