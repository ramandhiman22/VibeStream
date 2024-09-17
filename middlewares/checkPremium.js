const User = require('../models/user'); // Adjust the path as needed

const checkPremium = async (req, res, next) => {
    try {
        const userId = req.user.id; // Ensure req.user is set by your authentication middleware

        // Fetch user details from the database
        const user = await User.findByPk(userId);

        // Debugging logs
        console.log('User fetched:', user); // Log the user object

        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Check if the user is premium
        if (!user.premium) {  // Ensure the correct field name is used here
            console.log('User is not premium:', user.premium); // Log the premium status
            return res.status(403).json({ message: 'You must be a premium user to download this track.' });
        }

        // If user is premium, proceed to the next middleware/route handler
        next();
    } catch (error) {
        console.error('Error checking premium status:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = checkPremium;
