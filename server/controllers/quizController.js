const quizModel = require('../models/QuizModel'); // Update path as necessary
const AccessKey = require('../models/AccessKey'); // Import your AccessKey model


// create Quiz
const createQuiz = async (req, res) => {
    
    // fetch the current access key
    try {
        const accessKeyDocument = await AccessKey.findOne();

        if (!accessKeyDocument) {
            // If no access key document exists, create one
            await AccessKey.create({ currentKey: "frui44f" });
            accessKeyDocument = await AccessKey.findOne();

        }
        
        
        // Get the current key and increment it
        const currentAccessKey = accessKeyDocument.currentKey;

        // create the quiz
        const newQuiz = new quizModel({
            _id: currentAccessKey, // use the access key as the quiz _id
            title: req.body.title,
            description: req.body.description,
            questions: req.body.questions,
            created_by: req.user._id,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
        });

        // console.log(newQuiz);
        await newQuiz.save();
        
        // Increment the key manually & save
        let incrementedKey = (parseInt(currentAccessKey) + 1).toString().padStart(4, '0');
        await AccessKey.updateOne({}, { currentKey: incrementedKey });

        res.status(201).json({ message: 'Quiz created successfully', newQuiz });
    } catch (error) {
        res.status(500).json({ message: 'Server error : failed to creat e qui z=', error: error.message });
    }
};


// get Quiz
const getQuiz = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ created_by: req.user._id });
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// update Quiz
const updateQuiz = async (req, res) => {
    const { quizId, title, description, questions, start_time, end_time } = req.body;

    try {
        const quiz = await quizModel.findById(quizId);
        if (!quiz || quiz.created_by.toString() !== req.user._id) {
            return res.status(404).json({ message: 'Quiz not found or unauthorized' });
        }

        quiz.title = title || quiz.title;
        quiz.description = description || quiz.description;
        quiz.questions = questions || quiz.questions;
        quiz.start_time = start_time || quiz.start_time;
        quiz.end_time = end_time || quiz.end_time;

        await quiz.save();
        res.status(200).json({ message: 'Quiz updated successfully', quiz });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// delete Quiz
const deleteQuiz = async (req, res) => {
    const { quizId } = req.body;

    try {
        const quiz = await quizModel.findById(quizId);
        if (!quiz || quiz.created_by.toString() !== req.user._id) {
            return res.status(404).json({ message: 'Quiz not found or unauthorized' });
        }

        await quiz.remove();
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createQuiz, getQuiz, updateQuiz, deleteQuiz };
