const express = require('express');
const router = express.Router();
const isAuthenticated=require('../middlewares/is_authenticated.middleware')
const UserController = require('../controller/user.controller');
const upload = require('../middlewares/multer');


// Route to view user profile
router.get('/profile', UserController.getProfile);

// Route to logout
router.post('/logout', UserController.logout);
router.get('/edit-profile', UserController.showEditProfile);
router.post('/update-profile', upload.single('image'), UserController.updateProfile);
module.exports = router;
