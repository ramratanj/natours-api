const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/', userController.getAllUsers);

// router.post('/', (req, res) => {
//   res.send('Create a user');
// });

// Define other routes for users

module.exports = router;
