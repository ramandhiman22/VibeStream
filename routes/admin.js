const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const Admin = require('../models/admin');
const Track = require('../models/track'); // Assuming you have a Track model
const router = express.Router();

// Session setup
router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    } else {
        res.status(403).send('Access denied. Admins only.');
    }
}

// Admin registration route
router.get('/register', (req, res) => {
    res.render('admin/adminRegister'); // Render the admin registration page (create adminRegister.ejs)
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username is already taken
        const existingAdmin = await Admin.findOne({ where: { username } });
        if (existingAdmin) {
            return res.status(400).send('Username already taken');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new admin
        const newAdmin = await Admin.create({
            username,
            password: hashedPassword,
            isAdmin: true
        });

        // Store admin details in the session
        req.session.adminId = newAdmin.id;
        req.session.isAdmin = newAdmin.isAdmin;

        // Redirect to the admin dashboard or home page
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).send('Server error');
    }
});

// Admin login route
router.get('/login', (req, res) => {
    res.render('admin/adminLogin'); // Render the admin login page (create adminLogin.ejs)
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the admin by username
        const admin = await Admin.findOne({ where: { username } });

        if (!admin) {
            return res.status(401).send('Invalid credentials');
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Store admin details in the session
        req.session.adminId = admin.id;
        req.session.username = admin.username;
        req.session.isAdmin = admin.isAdmin;

        // Redirect to the admin dashboard or home page
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).send('Server error');
    }
});

// Admin logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.redirect('/admin/login');
    });
});

// Admin dashboard route (protected)
router.get('/dashboard', isAdmin, (req, res) => {
    // Retrieve admin details from the session or database
    const adminDetails = {
        name: req.session.username // Assuming 'username' was saved in session during login
    };

    res.render('admin/adminDashboard', { admin: adminDetails });
});



module.exports = router;
