var express = require('express');
var router = express.Router();

// Process 404
router.use(function(req, res, next) {
    // All non-errors that haven't been handled up until this point are turned
    // into HTTP 404 errors
    res.status(404).json({ "message": "Not Found" });
});

// Process Errors
router.use(function(err, req, res) {
    // All errors that haven't been handled up until this point are turned into
    // HTTP 500 errors
    res.status(500).json({ "message": "Internal Server Error" });
});

module.exports = router;
