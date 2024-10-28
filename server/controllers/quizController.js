const quizModel = require('../models/QuizModel'); // Update path as necessary
const resultModel = require('../models/ResultModel');
const userModel = require('../models/userModel'); // user modal 
const AccessKey = require('../models/AccessKey'); // Import your AccessKey model
const CryptoJS = require("crypto-js");
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.ENCRYPTION_KEY;

// Encryption function
const encryptData = (data, secretKey) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
};

// Decryption function
const decryptData = (ciphertext, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

/*
 // Store securely in env variable

const quiz = {
    title: encryptData("Sample Quiz", secretKey),
    questions: encryptData(JSON.stringify(questionsArray), secretKey)
};

await quizModel.create(quiz);

const quiz = await quizModel.findById(quizId);
const decryptedQuiz = {
    title: decryptData(quiz.title, secretKey),
    questions: JSON.parse(decryptData(quiz.questions, secretKey))
};
*/

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

        const encryptedQuestions  = encryptData(JSON.stringify(req.body.questions), secretKey);

        // console.log(JSON.parse(decryptData(qe,secretKey)));

        // create the quiz
        const newQuiz = new quizModel({
            _id: currentAccessKey, // use the access key as the quiz _id
            title: req.body.title,
            description: req.body.description,
            questions: encryptedQuestions,
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
        const quiz = await quizModel.findById(req.params.quizId).lean();
        quiz.questions = JSON.parse(decryptData(quiz.questions,secretKey));
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
            { id: 1, title: 1, end_time: 1 } // Project only required fields
        ).sort({ end_time: -1 }); // Sort by the creation date, newest first

        

        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch quiz history', error: error.message });
    }
};

// fetch quizzes the user has participated in
const getGivenQuizzesHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        // find all quizzes where the user is in the participants array
        const givenQuizzes = await quizModel.find({ participants: { $in: [userId] } })
            .select('_id title end_time')
            .sort({ end_time: -1 }); // select only necessary fields

        if (!givenQuizzes || givenQuizzes.length === 0) {
            return res.status(404).json({ message: 'No given quizzes found' });
        }

        // return summarized quiz details
        res.status(200).json(givenQuizzes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// update Quiz
const updateQuiz = async (req, res) => {
    const { quizId, changes} = req.body;

    try {
        const quiz = await quizModel.findById(quizId);
        
        if (!quiz || quiz.created_by.toString() !== req.user._id) {
            return res.status(404).json({ message: 'Quiz not found or unauthorized' });
        }

        quiz.title = changes.title || quiz.title;
        quiz.description = changes.description || quiz.description;
        quiz.questions = changes.questions || quiz.questions;
        quiz.start_time = changes.start_time || quiz.start_time;
        quiz.end_time = changes.end_time || quiz.end_time;

        await quiz.save();

        quiz.questions = JSON.parse(decryptData(quiz.questions,secretKey));

        res.status(200).json({ message: 'Quiz updated successfully'});
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
        const questions = JSON.parse(decryptData(quiz.questions, secretKey));
        let totalCorrect = 0;
        const totalQuestions = questions.length;

        //calculate total correct answers
        Object.keys(selectedOptions).forEach(question_id => {
            const selectedOption = selectedOptions[question_id];

            //find the corresponding question in the quiz
            const question = questions.find(q => q._id.toString() === question_id);


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

// fetch quiz and result details for a specific quiz
const getQuizAndResultDetails = async (req, res) => {
    const quizId = req.params.quizId;

    try {
        const userId = req.user._id;

        // find the quiz and the corresponding result for this user
        const quiz = await quizModel.findById(quizId).lean();
        const result = await resultModel.findOne({ quiz_id: quizId, user_id: userId });
        // console.log(req.params);
        if (!quiz || !result) {
            return res.status(404).json({ message: 'Quiz or result not found' });
        }
        quiz.questions = JSON.parse(decryptData(quiz.questions, secretKey));
        // send back both the quiz and result details
        res.status(200).json({
            quiz: quiz,
            result: result
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// fetch summarized result details 
const getQuizSummaryResult = async (req, res) => {
    const { quizId } = req.params;

    try {
        const userId = req.user._id;

        // find the quiz title and the corresponding result for this user
        const quiz = await quizModel.findById(quizId).select('title');
        const result = await resultModel.findOne({ quiz_id: quizId, user_id: userId })
            .select('total_correct total_questions submitted_at');

        if (!quiz || !result) {
            return res.status(404).json({ message: 'Quiz or result not found' });
        }

        // send summarized result details
        res.status(200).json({
            quiz_title: quiz.title,
            total_correct: result.total_correct,
            total_questions: result.total_questions,
            submitted_at: result.submitted_at
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// fetch summarized result details for a specific quiz - for creator
const getCreatedQuizResults = async (req, res) => {
    const { quizId } = req.params;


    try {
        // fetch quiz data
        const quiz = await quizModel.findById(quizId).select('title description start_time ');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // fetch results for the quiz
        const result = await resultModel.find({ quiz_id: quizId }).select('user_id total_correct total_questions');

        let totalQuestions = 0;
        const participants = await Promise.all(
            result.map(async (p) => {
                const user = await userModel.findOne({ _id: p.user_id }).select('name'); 
                if(totalQuestions===0){
                    totalQuestions=p._doc.total_questions;
                }
                p._doc.name = user.name; 
                delete p._doc.user_id;
                delete p._doc._id;
                delete p._doc.total_questions;
                return p;
            })
        );

        // prepare the response data
        const response = {
            title: quiz.title,
            datetime: quiz.start_time,
            totalQuestions: totalQuestions,
            participantsCount: participants.length,
            participants
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createQuiz, getQuiz, getCreatedQuizHistory, getGivenQuizzesHistory, updateQuiz, deleteQuiz, submitQuiz,
    getQuizAndResultDetails, getQuizSummaryResult, getCreatedQuizResults
};
