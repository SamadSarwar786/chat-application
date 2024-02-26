const express = require('express');
const { registerUser, loginUser, searchUsers } = require('../controllers/userController');
const multer  = require('multer');
const protect = require('../middleware/authMiddleware');
const upload = multer({ dest: 'uploads/' })
const router = express.Router();

// router.route('/').post(registerUser);
// router.route('/').post(registerUser).get(protect , searchUsers);
router.route('/').post(registerUser);
router.route('/search').get(protect,searchUsers); // work on query
router.post('/login', loginUser);



module.exports = router;