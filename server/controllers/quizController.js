const quizModel = require('../models/QuizModel'); // Update path as necessary
const resultModel = require('../models/ResultModel');
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
        const quiz = await quizModel.findById(req.params.quizId);
        // console.log(quiz);
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//get crated qui zhistory(sumarized)
const getCreatedQuizHistory = async (req, res) => {
    try {
        const quizzes = await quizModel.find(
            { created_by: req.user._id }, // Fetch quizzes created by the user
            { id: 1, title: 1, createdAt: 1 } // Project only required fields
        ).sort({ createdAt: -1 }); // Sort by the creation date, newest first

        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch quiz history', error: error.message });
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

        await quiz.deleteOne();
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


//submit Quiz Results
const submitQuiz = async (req, res) => {
    const { quizId, selectedOptions } = req.body;

    try {
        //fetch the quiz with questions and correct answers
        const quiz = await quizModel.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let totalCorrect = 0;
        const totalQuestions = quiz.questions.length;

        //calculate total correct answers
        Object.keys(selectedOptions).forEach(question_id => {
            const selectedOption = selectedOptions[question_id];

            //find the corresponding question in the quiz
            const question = quiz.questions.find(q => q._id.toString() === question_id);


            //check if the selected option matches the correct option
            if (question && question.correct_option === selectedOption) {
                totalCorrect += 1;
            }
        });

        // store the result
        const result = new resultModel({
            quiz_id: quizId,
            user_id: req.user._id,
            selected_options: selectedOptions,
            total_correct: totalCorrect,
            total_questions: totalQuestions
        });

        await result.save();

        // add the user to the participants array in the quiz
        // quiz.participants.push(req.user._id);
        quiz.participants = quiz.participants || [];
        quiz.participants.push(req.user._id);
        // console.log(quiz);
        await quiz.save();
        res.status(201).json({ message: 'Quiz submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { createQuiz, getQuiz, getCreatedQuizHistory, updateQuiz, deleteQuiz, submitQuiz };
