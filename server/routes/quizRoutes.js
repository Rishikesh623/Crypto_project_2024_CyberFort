
const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createQuiz, getQuiz, getCreatedQuizHistory, getGivenQuizzesHistory,
    updateQuiz, deleteQuiz, submitQuiz, getQuizAndResultDetails, getQuizSummaryResult, getCreatedQuizResults } = require('../controllers/quizController');


const router = express.Router();

router.post('/create-quiz', authMiddleware, createQuiz);
router.post('/submit-quiz', authMiddleware, submitQuiz);
router.get('/get-quiz/:quizId', authMiddleware, getQuiz);
router.get('/get-quiz-and-result/:quizId', authMiddleware, getQuizAndResultDetails);
router.get('/get-summarized-quiz_result/:quizId', authMiddleware, getQuizSummaryResult);
router.get('/get-created-quiz_result/:quizId', authMiddleware, getCreatedQuizResults);
router.get('/get-created-quiz-history', authMiddleware, getCreatedQuizHistory);
router.get('/get-given-quiz-history', authMiddleware, getGivenQuizzesHistory);
router.patch('/update-quiz', authMiddleware, updateQuiz);
router.delete('/delete-quiz', authMiddleware, deleteQuiz);

module.exports = router;