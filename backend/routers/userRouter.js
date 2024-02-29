const express = require('express');
const { registerUser, loginUser, searchUsers } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


// router.route('/').post(registerUser);
// router.route('/').post(registerUser).get(protect , searchUsers);
router.route('/').post(upload.single('pic'),registerUser);
router.route('/search').get(protect,searchUsers); // work on query
router.post('/login', loginUser);



module.exports = router;