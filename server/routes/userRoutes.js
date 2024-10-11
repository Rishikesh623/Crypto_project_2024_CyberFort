
const express = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware'); 
const {login,register,getProfile,editProfile} = require('../controllers/userController');


const router = express.Router();

router.post('/user/login',login);
router.post('/user/register',register);
router.get('/user/profile',authMiddleware,getProfile);
router.patch('/user/profile/edit',authMiddleware,editProfile);

module.exports = router;