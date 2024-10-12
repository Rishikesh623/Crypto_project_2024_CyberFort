
const express = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware'); 
const {login,register,getProfile,editProfile,changePassword,logout} = require('../controllers/userController');


const router = express.Router();

router.post('/user/login',login);
router.post('/user/register',register);
router.post('/user/logout',logout);
router.get('/user/profile',authMiddleware,getProfile);
router.patch('/user/profile/edit',authMiddleware,editProfile);
router.patch('/user/change-password',authMiddleware,changePassword);
module.exports = router;