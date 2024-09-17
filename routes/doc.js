const express = require('express');
const router = express.Router();
const DocController = require('../controller/doc.controller');

router.get('/AboutUs',DocController.showAbout);
router.get('/ContectUs',DocController.showContectUs);
router.get('/Term&Conditions',DocController.showTerm);
router.get('/Privacy&Policy',DocController.showPolicy);

module.exports = router;