const multer = require('multer');
const path = require('path');

// Configure storage options for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Create multer instance with storage configuration
const upload = multer({ storage });

module.exports = upload;