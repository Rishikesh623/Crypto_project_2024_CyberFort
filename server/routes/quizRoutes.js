
const express = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware'); 
const {createQuiz,getQuiz,updateQuiz,deleteQuiz} = require('../controllers/quizController');


const router = express.Router();

router.post('/create-quiz',authMiddleware,createQuiz);
router.get('/get-quiz',authMiddleware,getQuiz);
router.patch('/update-quiz',authMiddleware,updateQuiz);
router.post('/delete-quiz',authMiddleware,deleteQuiz);

module.exports = router;