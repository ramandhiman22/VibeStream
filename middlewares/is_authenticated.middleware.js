const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // User is authenticated, proceed
        return next();
    } else {
        // User is not authenticated, return an error
        res.status(401).json({ message: 'You need to log in to access this feature.' });
    }
};

module.exports = isAuthenticated;
