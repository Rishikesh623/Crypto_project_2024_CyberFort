
const express = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware'); 
const {createQuiz,getQuiz,getCreatedQuizHistory,updateQuiz,deleteQuiz, submitQuiz} = require('../controllers/quizController');


const router = express.Router();

router.post('/create-quiz',authMiddleware,createQuiz);
router.post('/submit-quiz',authMiddleware,submitQuiz);
router.get('/get-quiz/:quizId',authMiddleware,getQuiz);
router.get('/get-created-quiz-history',authMiddleware,getCreatedQuizHistory);
router.patch('/update-quiz',authMiddleware,updateQuiz);
router.delete('/delete-quiz',authMiddleware,deleteQuiz);

module.exports = router;