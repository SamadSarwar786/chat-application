const express = require('express');
const protect = require('../middleware/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, updateTheGroup } = require('../controllers/chatController');
const router = express.Router();

router.route('/').post(protect,accessChat).get(protect , fetchChats);
router.post('/creategrp',protect,createGroupChat);
router.route('/renamegrp').put(protect,renameGroup);
router.route('/groupadd').put(protect,addToGroup);
router.route('/groupremove').put(protect,removeFromGroup);
router.route('/groupupdate').put(protect,updateTheGroup);



module.exports = router;